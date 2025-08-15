#!/bin/bash

# Keep Alive Script for Supabase Project
# This script calls the hero classes endpoint to prevent Supabase from pausing due to inactivity

# Configuration
SUPABASE_URL="https://hasmzeqltdnshibkgbuj.supabase.co"
SUPABASE_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhc216ZXFsdGRuc2hpYmtnYnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTkyMTA4MTMsImV4cCI6MTk3NDc4NjgxM30.NKKEAnQPNeoohL6bjtfMlzlKbh_b-ewF3wosEI1-1rk"
ENDPOINT="/rest/v1/hero_class"
LOG_FILE="$HOME/supabase_keep_alive.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Create log directory if it doesn't exist
LOG_DIR=$(dirname "$LOG_FILE")
mkdir -p "$LOG_DIR"

# Function to log messages
log_message() {
    echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

# Function to make the API call
call_supabase_endpoint() {
    log_message "Making API call to Supabase endpoint..."
    
    # Make the HTTP request
    RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
        -H "apikey: $SUPABASE_API_KEY" \
        -H "Content-Type: application/json" \
        "$SUPABASE_URL$ENDPOINT")
    
    # Extract HTTP status and response body
    HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
    RESPONSE_BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS:")
    
    if [ "$HTTP_STATUS" = "200" ]; then
        log_message "✅ Success! HTTP Status: $HTTP_STATUS"
        log_message "Response: $RESPONSE_BODY"
        log_message "Supabase project kept alive successfully"
    else
        log_message "❌ Error! HTTP Status: $HTTP_STATUS"
        log_message "Response: $RESPONSE_BODY"
        log_message "Failed to keep Supabase project alive"
    fi
}

# Main execution
log_message "=== Starting Supabase Keep Alive Script ==="
call_supabase_endpoint
log_message "=== Script completed ==="
log_message ""

