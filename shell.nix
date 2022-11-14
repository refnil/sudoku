{ 
sources ? import ./nix/sources.nix, 
pkgs ? import sources.nixpkgs { overlays = [ rust-overlay ]; },
rust-overlay ? import sources.rust-overlay,
}:
let 
  rust =  pkgs.rust-bin.stable.latest.minimal.override {
    extensions = [
      "rustfmt-preview"
      "rust-analysis"
      # "rust-analyzer"
      "rust-src"
      "clippy"
    ];
    targets = [
      "wasm32-unknown-unknown"
    ];
  };
in pkgs.mkShell {
  buildInputs = [
    rust
    pkgs.wasm-pack
    pkgs.nodejs
    pkgs.cargo-watch
  ];
}
