#!/bin/bash

set -e

DEFAULT_USER="pptruser"

# Check if APP_UID and APP_GID are set
if [ -n "$APP_UID" ] && [ -n "$APP_GID" ]; then
    echo "APP_UID and APP_GID environment variables detected"
    echo "Setting user ID to $APP_UID and group ID to $APP_GID"
    
    # Change group ID first
    groupmod -o -g "$APP_GID" $DEFAULT_USER 2>/dev/null || {
        echo "Warning: Could not modify group. Group may not exist."
    }
    
    # Change user ID
    usermod -o -u "$APP_UID" $DEFAULT_USER 2>/dev/null || {
        echo "Warning: Could not modify user. User may not exist."
    }
    
    # Fix ownership of user's home directory
    USER_HOME=$(eval echo ~$DEFAULT_USER)
    if [ -d "$USER_HOME" ]; then
        chown -R $APP_UID:$APP_GID "$USER_HOME"
        echo "Updated ownership of $USER_HOME"
    fi
    
    USER_UID=$(id -u "$DEFAULT_USER")
    USER_GID=$(id -g "$DEFAULT_USER")
    echo "Successfully updated user $DEFAULT_USER to UID:$USER_UID, GID:$USER_GID"
    
    # Switch to the user and execute command if provided
    if [ $# -gt 0 ]; then
        echo "Executing command as $DEFAULT_USER: $@"
        exec su-exec $DEFAULT_USER "$@"
    else
        echo "No command provided. Switching to user $DEFAULT_USER"
        exec su-exec $DEFAULT_USER /bin/bash
    fi
else
    echo "APP_UID and/or APP_GID not set, using default user configuration"
    
    # Execute command as default user if provided
    if [ $# -gt 0 ]; then
        echo "Executing command as $DEFAULT_USER: $@"
        exec su-exec $DEFAULT_USER "$@"
    else
        echo "No command provided. Switching to user $DEFAULT_USER"
        exec su-exec $DEFAULT_USER /bin/bash
    fi
fi