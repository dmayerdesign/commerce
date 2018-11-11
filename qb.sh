#!/bin/bash

source ./.env

qb() {
    if [ "$1" = "dev" ]; then
        if [ "$2" = "ui" ]; then
            qb prebuild ui development;
            ng serve;
        elif [ "$2" = "server" ]; then
            qb prebuild server development;
            nodemon --config nodemon.json;
        else
            qb dev ui & qb dev server
        fi
    fi

    if [ "$1" = "build" ]; then

        # Pre-build.
        if [ "$2" = "ui" ]; then
            if [ "$3" = "development" ]; then
                export ENVIRONMENT=development
                qb generate app-config
            elif [ "$3" = "production" ]; then
                export ENVIRONMENT=production
                qb generate app-config
                qb test ui
            fi
        fi
        if [ "$2" = "server" ]; then
            qb generate mongoose-module-config
            if [ "$3" = "development" ]; then
                export ENVIRONMENT=development
                qb generate app-config
            elif [ "$3" = "production" ]; then
                export ENVIRONMENT=production
                qb generate app-config
                qb test server
            fi
        fi

        # Build.
        if [ "$2" = "common" ]; then
            # TODO: split into environments.
            export ENVIRONMENT=development
            qb generate all
            ng build common
        elif [ "$2" = "ui" ]; then
            if [ "$3" = "development" ]; then
                ng build web --configuration=development && ng run web:ssr:development
            elif [ "$3" = "production" ]; then
                ng build web --configuration=production && ng run web:ssr:production
            fi
        elif [ "$2" = "server" ]; then
            tsc -p server/tsconfig.server.json;
        elif [ "$2" = "all" ]; then
            if [ "$3" = "development" ]; then
                qb build ui development && qb build server development
            elif [ "$3" = "production" ]; then
                qb build ui production && qb build server production
            fi
        else
            if [ "$2" = "development" ]; then
                qb build all development
            elif [ "$2" = "production" ]; then
                qb build all production
            fi
        fi
    fi

    if [ "$1" = "test" ]; then
        if [ "$2" = "ui" ]; then
            if [ "$3" = "unit" ]; then
                jest --config ./jest.ui-unit.config.js
            elif [ "$3" = "e2e" ]; then
                ng e2e
            else
                qb test ui unit && qb test ui e2e
            fi
        fi
        
        if [ "$2" = "server" ]; then
            if [ "$3" = "unit" ]; then
                if [ "$4" = "watch" ]; then
                    jest --config ./server/test/jest-unit.config.js --watch
                elif [ "$4" = "cov" ]; then
                    jest --config ./server/test/jest-unit.config.js --coverage
                else
                    jest --config ./server/test/jest-unit.config.js
                fi
            fi
            if [ "$3" != "unit" ]; then
                qb test server unit
            fi
        fi
    fi

    if [ "$1" = "generate" ]; then
        if [ "$2" = "app-config" ]; then
            ts-node common/src/code-gen/generate-app-config.ts
        # elif [ "$2" = "public_api" ]; then
        #     ts-node common/src/code-gen/generate-public_api.ts
        elif [ "$2" = "mongoose-module-config" ]; then
            ts-node common/src/code-gen/generate-mongoose-module-config.ts
        elif [ "$2" = "all" ]; then
            export ENVIRONMENT=development
            qb generate app-config
            qb generate public_api
            qb generate mongoose-module-config
        else
            echo "" # Nothing.
        fi
    fi

    if [[ ("$1" = "help" || "$1" = "--help" || "$1" = "-h") ]]; then
        echo "
Usage of \"qb\" (or \"npm run qb\"):

Develop:        qb dev [ui|server]
Build:          qb build <ui|server|all> <development|production>
Test:           qb test ui [unit|e2e]
                qb test server [unit] [watch|cov]
Code gen:       qb generate all
";
    fi
}

qb "$1" "$2" "$3" "$4"
