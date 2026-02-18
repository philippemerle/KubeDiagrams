"""Utilitaires pour les services de génération de diagrammes."""
import base64
import shlex

from constants import TEXT_FORMATS

def has_fatal_error(stdout_txt: str, stderr_txt: str) -> bool:
    """
    Vérifie si la sortie contient une erreur fatale.
    
    Args:
        stdout_txt: Sortie standard
        stderr_txt: Sortie d'erreur
        
    Returns:
        bool: True si erreur fatale détectée
    """
    return ("error:" in (stdout_txt or "").lower()) or ("error:" in (stderr_txt or "").lower())


def parse_extra_args(extra_args: str) -> list[str]:
    """
    Parse les arguments supplémentaires.
    
    Args:
        extra_args: Arguments supplémentaires en string
        
    Returns:
        list[str]: Liste des arguments parsés
        
    Raises:
        ValueError: Si les arguments sont invalides
    """
    if not extra_args or not extra_args.strip():
        return []
    try:
        return shlex.split(extra_args.strip())
    except Exception as e:
        raise ValueError(f"Invalid extraArgs: {e}")


def encode_content(content: bytes, output_format: str) -> str:
    """
    Encode le contenu en base64 ou UTF-8 selon le format.
    
    Args:
        content: Contenu à encoder
        output_format: Format de sortie
        
    Returns:
        str: Contenu encodé
    """
    if output_format in TEXT_FORMATS:
        return content.decode("utf-8")
    return base64.b64encode(content).decode("utf-8")
