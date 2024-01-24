#!/bin/bash
cd /opt/my-atlas-boilerplate
echo "git pulling"
git pull origin main && 
echo "bun installing..." &&
bun install --save  &&
echo "reloading all the instances" &&
pm2 reload all &&
echo "deploy done ! Thank you"
