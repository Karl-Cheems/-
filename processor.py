
import json
import math
import os
import subprocess
from datetime import datetime

def calculate_focus_entropy(app_usage_dict):
    """
    Calculates the Shannon Entropy of app usage.
    Lower entropy indicates higher focus (usage concentrated in few apps).
    Higher entropy indicates fragmentation (usage spread across many apps).
    """
    total_time = sum(app_usage_dict.values())
    if total_time == 0:
        return 0.0
    
    entropy = 0.0
    for app_time in app_usage_dict.values():
        p_i = app_time / total_time
        if p_i > 0:
            entropy -= p_i * math.log2(p_i)
            
    # Normalize by log2(N) where N is number of apps to get a 0-1 range
    # Or just return raw bits. AI students usually prefer the raw bits or a custom coefficient.
    return round(entropy, 2)

def process_data(raw_json_path):
    with open(raw_json_path, 'r') as f:
        data = json.load(f)
    
    # Example structure extraction from iOS Shortcut JSON
    # Assuming data['apps'] is { "WeChat": 3600, "VS Code": 7200, ... }
    app_usage = data.get('apps', {})
    pickups = data.get('pickups', 0)
    total_seconds = sum(app_usage.values())
    
    entropy = calculate_focus_entropy(app_usage)
    
    summary = {
        "timestamp": datetime.now().isoformat(),
        "total_duration_sec": total_seconds,
        "pickups": pickups,
        "entropy": entropy,
        "hourly_distribution": data.get('hourly_distribution', [0]*24),
        "flow": data.get('flow', []), # List of [source, target, value]
        "apps": app_usage
    }
    
    # Save to data directory for SSG
    output_path = 'data/latest_metrics.json'
    os.makedirs('data', exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(summary, f, indent=2)
    
    return output_path

def git_sync():
    try:
        subprocess.run(["git", "add", "."], check=True)
        subprocess.run(["git", "commit", "-m", f"DATA_SYNC: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"], check=True)
        subprocess.run(["git", "push", "origin", "main"], check=True)
        print("> REPO_STATUS: GITHUB_PUSH_SUCCESS")
    except Exception as e:
        print(f"> REPO_STATUS: ERROR ({str(e)})")

if __name__ == "__main__":
    # In a real workflow, this would be triggered by an API endpoint or file watcher
    # processed_file = process_data('raw_input.json')
    # git_sync()
    print("DIGITAL_PULSE_PROCESSOR: READY")
