# Supabase Keep Alive Script Setup Guide

This guide will help you set up the `keep_alive.sh` script to run every 30
minutes on your MacBook Pro to prevent Supabase from pausing your project due to
inactivity.

## What the Script Does

The `keep_alive.sh` script:

- Calls your Supabase hero classes endpoint (`/rest/v1/hero_class`)
- Logs the results to `~/supabase_keep_alive.log`
- Provides detailed feedback on success/failure
- Uses your existing Supabase API key from the Bruno collection

## Quick Test

First, test the script to make sure it works:

```bash
./keep_alive.sh
```

You should see output like:

```
[2024-01-15 10:30:00] === Starting Supabase Keep Alive Script ===
[2024-01-15 10:30:00] Making API call to Supabase endpoint...
[2024-01-15 10:30:00] ✅ Success! HTTP Status: 200
[2024-01-15 10:30:00] Response: [{"id":1,"name":"Warrior"},{"id":2,"name":"Mage"}]
[2024-01-15 10:30:00] Supabase project kept alive successfully
[2024-01-15 10:30:00] === Script completed ===
```

## Setting Up Automatic Execution

### Option 1: Using launchd (Recommended)

1. Create a launch agent plist file:

```bash
mkdir -p ~/Library/LaunchAgents
```

2. Create the file `~/Library/LaunchAgents/com.supabase.keepalive.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.supabase.keepalive</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/sstella/workspace/showcase-react/keep_alive.sh</string>
    </array>
    <key>StartInterval</key>
    <integer>1800</integer>
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/supabase_keepalive.out</string>
    <key>StandardErrorPath</key>
    <string>/tmp/supabase_keepalive.err</string>
</dict>
</plist>
```

3. Load the launch agent:

```bash
launchctl load ~/Library/LaunchAgents/com.supabase.keepalive.plist
```

4. Start the service:

```bash
launchctl start com.supabase.keepalive
```

### Option 2: Using crontab

1. Open your crontab:

```bash
crontab -e
```

2. Add this line to run every 30 minutes:

```bash
*/30 * * * * /Users/sstella/workspace/showcase-react/keep_alive.sh
```

3. Save and exit (usually Ctrl+X, then Y, then Enter in nano)

## Verification

### Check if the service is running:

```bash
# For launchd
launchctl list | grep supabase

# For crontab
crontab -l
```

### Check the logs:

```bash
tail -f ~/supabase_keep_alive.log
```

### Test the endpoint manually:

```bash
curl -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhc216ZXFsdGRuc2hpYmtnYnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTkyMTA4MTMsImV4cCI6MTk3NDc4NjgxM30.NKKEAnQPNeoohL6bjtfMlzlKbh_b-ewF3wosEI1-1rk" \
     -H "Content-Type: application/json" \
     "https://hasmzeqltdnshibkgbuj.supabase.co/rest/v1/hero_class"
```

## Stopping the Service

### For launchd:

```bash
launchctl unload ~/Library/LaunchAgents/com.supabase.keepalive.plist
```

### For crontab:

```bash
crontab -e
# Remove the line with the script
```

## Log File Location

The script logs to: `~/supabase_keep_alive.log`

You can monitor it in real-time with:

```bash
tail -f ~/supabase_keep_alive.log
```

## Troubleshooting

### Script not running:

1. Check if the script is executable: `ls -la keep_alive.sh`
2. Test manually: `./keep_alive.sh`
3. Check launchd status: `launchctl list | grep supabase`

### Permission issues:

1. Make sure the script is executable: `chmod +x keep_alive.sh`
2. Check file ownership: `ls -la keep_alive.sh`

### API errors:

1. Verify your Supabase URL and API key are correct
2. Check if your Supabase project is active
3. Test the endpoint manually with curl

## Security Notes

- The script contains your Supabase API key in plain text
- Consider using environment variables for production use
- The log file contains API responses - review for sensitive data
- The script only has read access to your hero_classes table

## Customization

You can modify the script to:

- Call different endpoints
- Change the logging format
- Add email notifications on failures
- Adjust the frequency of calls
- Use different authentication methods
