#!/bin/bash
REM_USER="root"
declare -a REM_SERVERS=( "0.0.0.0")
for target in "${REM_SERVERS[@]}"
do
 echo "talking to ${target} ...."
 ssh -T ${REM_USER}@${target}<<-END
    cd /opt/my-atlas-boilerplate
    ls -a
    bash git-deploy.sh
END
done
