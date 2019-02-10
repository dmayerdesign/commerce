#!/bin/bash

# If an entrypoint file exists, use it.
if [ -f ./entrypoint.sh ]; then
    source ./entrypoint.sh
fi

test() {
    if [ "$1" = "ui" ]; then
        if [ "$2" = "unit" ]; then
            jest --config ./jest.ui-unit.config.js
        elif [ "$2" = "e2e" ]; then
            ng e2e
        else
            test ui unit && test ui e2e
        fi
    fi
    
    if [ "$1" = "server" ]; then
        if [ "$2" = "unit" ]; then
            if [ "$3" = "watch" ]; then
                jest --config ./server/test/jest-unit.config.js --watch
            elif [ "$3" = "cov" ]; then
                jest --config ./server/test/jest-unit.config.js --coverage
            else
                jest --config ./server/test/jest-unit.config.js
            fi
        fi
        if [ "$2" != "unit" ]; then
            test server unit
        fi
    fi
}

generate() {
    if [ "$1" = "app-config" ]; then
        ts-node common/src/code-gen/generate-app-config.ts
    elif [ "$1" = "angular-data-services" ]; then
        ts-node common/src/code-gen/generate-angular-data-services.ts
    elif [ "$1" = "nest-domain-modules" ]; then
        ts-node common/src/code-gen/generate-nest-domain-modules.ts
    elif [ "$1" = "nest-domain-repos" ]; then
        ts-node common/src/code-gen/generate-nest-domain-repos.ts
    else
        generate app-config
        generate angular-data-services
        # generate nest-domain-modules
        # generate nest-domain-repos
    fi
}

prebuild() {
    local env=$2

    if [ -z "$env" ]; then
        env=development
    fi
    export ENVIRONMENT=$env

    if [ "$1" = "ui" ]; then
        generate app-config
        generate angular-data-services
        
        # if [ "$env" = "production" ]; then
        #     test ui
        # fi
    fi
    if [ "$1" = "server" ]; then
        generate app-config
        # generate nest-domain-modules
        # generate nest-domain-repos
        
        # if [ "$env" = "production" ]; then
        #     test server
        # fi
    fi
}

build() {
    local env=$2
    if [ -z "$env" ]; then
        env=development
    fi
    export ENVIRONMENT=$env

    prebuild $1 $2 $3

    if [ "$1" = "common" ]; then
        generate
        ng build common
    elif [ "$1" = "ui" ]; then
        ng build web --configuration=$env && ng run web:ssr:$env
    elif [ "$1" = "server" ]; then
        tsc -p server/tsconfig.server.json
        mkdir -p ./dist/server/server/src/domains/email/emails/templates
        cp -r \
            ./server/src/domains/email/emails/templates/. \
            ./dist/server/server/src/domains/email/emails/templates
        cp -r \
            ./server/src/domains/email/emails/partials/. \
            ./dist/server/server/src/domains/email/emails/partials
        cp -r \
            ./work-files/. \
            ./dist/server/work-files
    else
        build ui $env && build server $env
    fi
}

dev() {
    export ENVIRONMENT=development
    if [ "$1" = "ui" ]; then
        prebuild ui
        ng serve
    elif [ "$1" = "server" ]; then
        prebuild server
        nodemon --config nodemon.json
    else
        dev ui & dev server
    fi
}

qb() {
    if [ "$1" = "dev" ]; then
        dev ${@:2}
    fi

    if [ "$1" = "build" ]; then
        build ${@:2}
    fi

    if [ "$1" = "test" ]; then
        test ${@:2}
    fi

    if [ "$1" = "generate" ]; then
        generate ${@:2}
    fi

    if [ -z $1 ] || [ "$1" = "help" ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
        echo "
_____________________________________________________________________
                                                                    |
                                                                    |
Usage of 'qb' (or 'npm run qb'):                                    |
                                                                    |   
Develop:        qb dev [ui|server]                                  |
Build:          qb build <ui|server|all> <development|production>   |
Test:           qb test ui [unit|e2e]                               |
                qb test server [unit] [watch|cov]                   |
Code gen:       qb generate                                         |
                                                                    |
____________________________________________________________________|
";                                                                  
    fi
}

qb "$@"
