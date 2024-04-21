package argon2id

import (
	"bytes"
	"crypto/rand"
	"errors"
	"golang.org/x/crypto/argon2"
)

// Disclaimer: The method of hashing passwords is based on the Argon2id algorithm and the tutorial from: https://snyk.io/blog/secure-password-hashing-in-go/
// The Argon2id algorithm is the winner of the Password Hashing Competition in 2015 and is considered one of the best algorithm for handling password hashing.

// HashSalt struct used to store generated hash and salt used to generate the hash.
type HashSalt struct {
	Hash, Salt []byte
}

type Hash struct {
	// time represents the number of passed over the specified memory.
	time uint32
	// cpu memory to be used.
	memory uint32
	// threads for parallelism aspect of the algorithm.
	threads uint8
	// keyLen of the generate hash key.
	keyLen uint32
	// saltLen the length of the salt used.
	saltLen uint32
}

// NewHash constructor function for Hash.
func NewHash(time, saltLen uint32, memory uint32, threads uint8, keyLen uint32) *Hash {
	return &Hash{
		time:    time,
		saltLen: saltLen,
		memory:  memory,
		threads: threads,
		keyLen:  keyLen,
	}
}

// GenerateSalt function to generate a random salt/secret value.
func GenerateSalt(length uint32) ([]byte, error) {
	secret := make([]byte, length)
	_, err := rand.Read(secret)
	if err != nil {
		return nil, err
	}
	return secret, nil
}

// GenerateHash using the password and provided salt.
// If no salt value is provided, fallback to random value generated of a given length.
func (a *Hash) GenerateHash(password, salt []byte) (*HashSalt, error) {
	var err error

	// If salt is not provided generate a salt of the configured salt length.
	if len(salt) == 0 {
		salt, err = GenerateSalt(a.saltLen)
	}
	if err != nil {
		return nil, err
	}

	// Generate hash
	hash := argon2.IDKey(password, salt, a.time, a.memory, a.threads, a.keyLen)

	// Return the generated hash and salt used for storage.
	return &HashSalt{Hash: hash, Salt: salt}, nil
}

// Compare generated hash with store hash.
func (a *Hash) Compare(hash, salt, password []byte) error {
	// Generate hash for comparison.
	hashSalt, err := a.GenerateHash(password, salt)

	if err != nil {
		return err
	}

	// Compare the generated hash with the stored hash.
	if !bytes.Equal(hash, hashSalt.Hash) {
		return errors.New("hash doesn't match")
	}
	return nil
}

func StringCompare(hashString1 string, hashString2 string) bool {
	return hashString1 == hashString2
}
