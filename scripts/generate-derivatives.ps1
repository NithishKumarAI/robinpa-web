Add-Type -AssemblyName System.Drawing

$masterPath = "C:\My PC\git\robinpa-web\public\branding\robin-master.png"
if (-not (Test-Path $masterPath)) {
    Write-Error "Master file not found: $masterPath"
    exit 1
}

$master = [System.Drawing.Bitmap]::FromFile($masterPath)

function Resize-Image($srcBmp, [int]$w, [int]$h, [string]$destPath) {
    $dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($srcBmp, 0, 0, $w, $h)
    $g.Dispose()
    
    $destDir = [System.IO.Path]::GetDirectoryName($destPath)
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    
    $dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $dest.Dispose()
    Write-Output "Generated: $destPath ($w x $h)"
}

# 1. Google OAuth icon (120x120 PNG, under 1 MB)
Resize-Image $master 120 120 "C:\My PC\git\robinpa-web\public\branding\robin-oauth-120.png"

# 2. icon-512.png (512x512)
Resize-Image $master 512 512 "C:\My PC\git\robinpa-web\public\branding\icon-512.png"

# 3. icon-192.png (192x192)
Resize-Image $master 192 192 "C:\My PC\git\robinpa-web\public\branding\icon-192.png"

# 4. apple-touch-icon.png (180x180)
Resize-Image $master 180 180 "C:\My PC\git\robinpa-web\public\branding\apple-touch-icon.png"
Resize-Image $master 180 180 "C:\My PC\git\robinpa-web\src\app\apple-icon.png"

# 5. icon-48.png & icon-32.png
Resize-Image $master 48 48 "C:\My PC\git\robinpa-web\public\branding\icon-48.png"
Resize-Image $master 32 32 "C:\My PC\git\robinpa-web\public\branding\icon-32.png"
Resize-Image $master 32 32 "C:\My PC\git\robinpa-web\src\app\icon.png"

# 6. favicon.ico
$bmp32 = New-Object System.Drawing.Bitmap(32, 32, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g32 = [System.Drawing.Graphics]::FromImage($bmp32)
$g32.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g32.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g32.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g32.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$g32.Clear([System.Drawing.Color]::Transparent)
$g32.DrawImage($master, 0, 0, 32, 32)
$g32.Dispose()

$hIcon = $bmp32.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = [System.IO.File]::OpenWrite("C:\My PC\git\robinpa-web\public\favicon.ico")
$icon.Save($fs)
$fs.Close()
$icon.Dispose()
$bmp32.Dispose()
Copy-Item "C:\My PC\git\robinpa-web\public\favicon.ico" "C:\My PC\git\robinpa-web\src\app\favicon.ico" -Force

$master.Dispose()
Write-Output "All derivatives successfully generated."
