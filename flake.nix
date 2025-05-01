{
  description = "Flake for github:philippemerle/KubeDiagrams";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = nixpkgs.legacyPackages.${system};
        pythonEnv = pkgs.python312.withPackages (ps: [ps.pyyaml ps.diagrams]);

        kube-diagrams = pkgs.stdenv.mkDerivation {
          pname = "kube-diagrams";
          version = "0.3.0";
          src = self;
          postPatch = ''
            substituteInPlace bin/kube-diagrams \
              --replace '/usr/bin/env python3' '${pythonEnv}/bin/python'
          '';
          installPhase = ''
            mkdir -p $out/bin
            cp -r bin/* $out/bin/
            chmod +x $out/bin/*-diagrams
          '';
        };

        runtimeEnv = with pkgs;
          [
            cacert
            graphviz
            kubernetes-helm
            kube-diagrams
            pythonEnv
          ]
          ++ lib.optionals pkgs.stdenv.isLinux [busybox];
      in {
        devShells.default = pkgs.mkShell {
          packages = with pkgs;
            [
              git
              lazygit
              nodePackages.prettier
            ]
            ++ runtimeEnv;
        };

        packages = {
          default = kube-diagrams;
          kube-diagrams = kube-diagrams;
          docker = pkgs.dockerTools.buildImage {
            name = "ghcr.io/philippemerle/kubediagrams";
            tag = "latest";
            copyToRoot = runtimeEnv;
            created = builtins.substring 0 8 self.lastModifiedDate;
          };
        };
      }
    );
}
