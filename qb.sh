#!/bin/bash

source ./.env

alias nrqb="npm run qb"

qb() {
    if [ "$1" = "dev" ]; then
        if [ "$2" = "ui" ]; then
            nrqb prebuild ui development;
            ng serve;
        elif [ "$2" = "server" ]; then
            nrqb prebuild server development;
            nodemon --config nodemon.json;
        fi
    fi

    if [ "$1" = "build" ]; then

        # Pre-build.
        if [ "$2" = "ui" ]; then
            if [ "$3" = "development" ]; then
                export ENVIRONMENT=development
                nrqb generate app_config
            elif [ "$3" = "production" ]; then
                export ENVIRONMENT=production
                nrqb generate app_config
                nrqb test ui
            fi
        fi
        if [ "$2" = "server" ]; then
            if [ "$3" = "development" ]; then
                export ENVIRONMENT=development
                nrqb generate app_config
            elif [ "$3" = "production" ]; then
                export ENVIRONMENT=production
                nrqb generate app_config
                nrqb test server
            fi
        fi

        # Build.
        if [ "$2" = "common" ]; then
            # TODO: split into environments.
            export ENVIRONMENT=development
            nrqb generate all
            ng build common
        fi
        if [ "$2" = "ui" ]; then
            if [ "$3" = "development" ]; then
                ng build web --configuration=development && ng run web ssr
            elif [ "$3" = "production" ]; then
                ng build web --configuration=production && ng run web ssr production
            fi
        fi
        if [ "$2" = "server" ]; then
            tsc -p server/tsconfig.server.json;
            # if [ "$3" = "development" ]; then
            # fi
            # if [ "$3" = "production" ]; then
            # fi
        fi
        if [ "$2" = "all" ]; then
            if [ "$3" = "development" ]; then
                nrqb build ui development && nrqb build server development
            elif [ "$3" = "production" ]; then
                nrqb build ui production && nrqb build server production
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
                nrqb test ui unit && nrqb test ui e2e
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
                nrqb test server unit
            fi
        fi
    fi

    if [ "$1" = "generate" ]; then
        if [ "$2" = "app_config" ]; then
            ts-node common/src/code-gen/generate-app-config.ts
        elif [ "$2" = "public_api" ]; then
            ts-node common/src/code-gen/generate-public_api.ts
        elif [ "$2" = "all" ]; then
            export ENVIRONMENT=development
            nrqb generate app_config
            nrqb generate public_api
        else
            echo "" # Nothing.
        fi
    fi
}

qb "$1" "$2" "$3" "$4"
