'''
    Setup PyPI package.
'''
import glob
from setuptools import setup

with open("README.md", encoding="utf-8") as readme:
    setup(
        name="KubeDiagrams",
        version="0.3.0",
        author="Philippe Merle",
        author_email="philippe.merle@inria.fr",
        maintainer="Philippe Merle",
        maintainer_email="philippe.merle@inria.fr",
        url="https://github.com/philippemerle/KubeDiagrams",
        description="Generate Kubernetes architecture diagrams from "
            "Kubernetes manifest files, kustomization files, Helm charts, "
            "and actual cluster state",
        long_description=readme.read(),
        long_description_content_type="text/markdown",
        license="GPL-3.0-only",
        classifiers=[
            "Topic :: Software Development :: Documentation",
            "Topic :: Utilities",
            "Development Status :: 5 - Production/Stable",
            "Programming Language :: Python :: 3.9",
            "Programming Language :: Python :: 3.10",
            "Programming Language :: Python :: 3.11",
            "Programming Language :: Python :: 3.12",
            "Programming Language :: Python :: 3.13",
            "Operating System :: OS Independent",
            "Environment :: Console",
            "Intended Audience :: Developers",
            "Intended Audience :: Information Technology",
            "Natural Language :: English",
        ],
        keywords = "kubernetes architecture diagrams",
        python_requires=">=3.9",
        install_requires=[
            "PyYAML",
            "diagrams",
        ],
        packages=[],
        package_dir={},
        scripts=[
            "bin/kube-diagrams",
            "bin/helm-diagrams",
        ],
        data_files=[
            ("bin", ["bin/kube-diagrams.yaml"]),
            ("bin/icons", glob.glob("bin/icons/*")),
        ],
        project_urls={
            "Issues": "https://github.com/philippemerle/KubeDiagrams/issues",
            "Discussions": "https://github.com/philippemerle/KubeDiagrams/discussions",
            "Wiki": "https://github.com/philippemerle/KubeDiagrams/wiki",
        },
    )
