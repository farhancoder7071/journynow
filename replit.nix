{ pkgs }: {
  deps = [
    pkgs.sdkmanager
    pkgs.openjdk17-bootstrap
    pkgs.gradle
    pkgs.nodejs_20  # Node.js 20 + npm
    pkgs.yarn        # Yarn package manager
    pkgs.curl        # Curl for downloading
    pkgs.git         # Git support
    pkgs.unzip       # Unzip tool
  ];
}