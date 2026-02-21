import os
import json
import re
from urllib.parse import quote

source_base = r"D:\Colin Cherry Music\Releases"
base_url = "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/music/"
manifest = []

def get_track_info(filename):
    # Match "Number - Title" or just "Title"
    match = re.match(r"(\d+)\s*-\s*(.*)\.(wav|mp3)$", filename, re.IGNORECASE)
    if match:
        return int(match.group(1)), match.group(2).strip()
    name_no_ext = os.path.splitext(filename)[0]
    # Clean up single track names if they have weird prefixes
    clean_name = re.sub(r"^\d+\s*-\s*", "", name_no_ext).strip()
    return None, clean_name

# Group by folder (Album)
album_data = {}

for album_folder in os.listdir(source_base):
    album_source_dir = os.path.join(source_base, album_folder)
    if not os.path.isdir(album_source_dir):
        continue
    
    # 1. Select Best Cover Art
    cover_candidates = [f for f in os.listdir(album_source_dir) if f.lower().endswith(('.jpg', '.png'))]
    best_cover = None
    if cover_candidates:
        for c in cover_candidates:
            if os.path.splitext(c)[0].lower() == album_folder.lower():
                best_cover = c
                break
        if not best_cover:
            best_cover = cover_candidates[0]

    # 2. Process Tracks
    tracks = []
    for f in os.listdir(album_source_dir):
        if f.lower().endswith(('.wav', '.mp3')):
            if "instrumental" in f.lower():
                continue
            
            track_no, title = get_track_info(f)
            
            # Proper URL Encoding
            encoded_folder = quote(album_folder)
            encoded_file = quote(f)
            track_url = f"{base_url}{encoded_folder}/{encoded_file}"
            
            tracks.append({
                "title": title,
                "track_number": track_no,
                "url": track_url
            })

    if tracks:
        # Sort tracks by track_number if available, else by title
        tracks.sort(key=lambda x: (x['track_number'] is None, x['track_number'], x['title']))
        
        cover_url = None
        if best_cover:
            cover_url = f"{base_url}{quote(album_folder)}/{quote(best_cover)}"

        album_data[album_folder] = {
            "album_name": album_folder,
            "artist": "Colin Cherry",
            "type": "Album" if len(tracks) > 1 else "Single",
            "cover_url": cover_url,
            "tracks": tracks
        }

# Convert to list for final manifest
final_manifest = list(album_data.values())

# Write manifest
output_path = r"S:\CherryOS\CherryOS-dev\src\data\music_manifest.json"
with open(output_path, 'w') as f:
    json.dump(final_manifest, f, indent=2)

print(f"Refined manifest generated with {len(final_manifest)} collections at {output_path}")
