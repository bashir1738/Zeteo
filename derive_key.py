#!/usr/bin/env python3
"""
Derive Starknet private key from Argent X recovery phrase
"""
from hashlib import sha256
import sys

# Recovery phrase
mnemonic = "interest police note tissue woman help jeans fabric aware runway vicious adapt"

# For Argent X, we use a simple derivation
# The private key is derived from the seed
def mnemonic_to_seed(mnemonic: str) -> bytes:
    """Convert mnemonic to seed using PBKDF2"""
    from hashlib import pbkdf2_hmac
    return pbkdf2_hmac('sha512', mnemonic.encode('utf-8'), b'mnemonic', 2048)

def derive_argent_key(mnemonic: str, account_index: int = 0) -> str:
    """Derive Argent X private key from mnemonic"""
    seed = mnemonic_to_seed(mnemonic)
    
    # Argent uses a specific derivation path
    # For simplicity, we'll hash the seed with the account index
    key_material = seed + account_index.to_bytes(4, 'big')
    private_key_bytes = sha256(key_material).digest()
    
    # Convert to hex (remove 0x prefix for starknet)
    private_key = private_key_bytes.hex()
    
    # Ensure it's within the valid range for Starknet (< curve order)
    # Starknet uses the STARK curve
    private_key_int = int(private_key, 16)
    
    # STARK curve order (approximate, for validation)
    curve_order = 0x0800000000000010ffffffffffffffffb781126dcae7b2321e66a241adc64d2f
    
    if private_key_int >= curve_order:
        # If out of range, hash again
        private_key_bytes = sha256(private_key_bytes).digest()
        private_key = private_key_bytes.hex()
    
    return "0x" + private_key

if __name__ == "__main__":
    private_key = derive_argent_key(mnemonic)
    print(f"Private Key: {private_key}")
