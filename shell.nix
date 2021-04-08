{ 
sources ? import ./nix/sources.nix, 
pkgs ? import sources.nixpkgs { overlays = [ mozilla-overlay ]; },
mozilla-overlay ? import sources.nixpkgs-mozilla,
}:
let 
  nightly-rust = pkgs.latest.rustChannels.stable;
  rust = nightly-rust.rust.override {
    extensions = [
      "rust-src"
      "rls-preview"
      "clippy-preview"
      "rustfmt-preview"
      "rust-analysis"
      "rls-preview"
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
  ];
}
