{ 
sources ? import ./nix/sources.nix, 
pkgs ? import sources.nixpkgs { overlays = [ mozilla-overlay ]; },
mozilla-overlay ? import sources.nixpkgs-mozilla,
}:
let 
  rust =  pkgs.latest.rustChannels.stable;
  cargo = rust.rust.override {
    extensions = [
      "rustfmt-preview"
    ];
    targets = [
      "wasm32-unknown-unknown"
    ];
  };
  rustc = rust.rustc.override {
  };
in pkgs.mkShell {
  buildInputs = [
    cargo
    rustc
    pkgs.wasm-pack
    pkgs.nodejs
    pkgs.cargo-watch
  ];
}
