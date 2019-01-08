#!/bin/bash

# If a .env file exists, use it.
[[ -f ./.env ]] && source ./.env

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
    else
        generate app-config
        generate angular-data-services
    fi
}

prebuild() {
    local env=$2
    [[ -z "$env" ]] && env=development
    export ENVIRONMENT=$env

    if [ "$1" = "ui" ]; then
        generate app-config
        generate angular-data-services
        
        if [ "$env" = "production" ]; then
            test ui
        fi
    fi
    if [ "$1" = "server" ]; then
        generate app-config
        generate angular-data-services
        
        if [ "$env" = "production" ]; then
            test server
        fi
    fi
}

build() {
    local env=$2
    [[ -z "$env" ]] && env=development
    export ENVIRONMENT=$env

    prebuild $1 $2 $3

    if [ "$1" = "common" ]; then
        generate
        ng build common
    elif [ "$1" = "ui" ]; then
        if [ "$env" = "development" ]; then
            ng build web --configuration=development && ng run web:ssr:development
        elif [ "$env" = "production" ]; then
            ng build web --configuration=production && ng run web:ssr:production
        fi
    elif [ "$1" = "server" ]; then
        # For the server, environment only matters in the prebuild step.
        tsc -p server/tsconfig.server.json
    else
        if [ "$env" = "development" ]; then
            build ui development && build server development
        elif [ "$env" = "production" ]; then
            build ui production && build server production
        fi
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
        dev $2 $3 $4
    fi

    if [ "$1" = "build" ]; then
        build $2 $3 $4
    fi

    if [ "$1" = "test" ]; then
        test $2 $3 $4
    fi

    if [ "$1" = "generate" ]; then
        generate $2 $3 $4
    fi

    if [[ (-z $1 || "$1" = "help" || "$1" = "--help" || "$1" = "-h") ]]; then
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

qb "$1" "$2" "$3" "$4"
