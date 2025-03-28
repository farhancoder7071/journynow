{pkgs}: {
  deps = [
    pkgs.nodejs
    pkgs.ocamlPackages.json-data-encoding-bson
    pkgs.jetbrains-mono
    pkgs.haskellPackages.json-assertions
    pkgs.jansson
    pkgs.haskellPackages.jason
  ];
}
