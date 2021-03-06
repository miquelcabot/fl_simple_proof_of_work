const crypto = require('crypto');
const inc = require('increment-buffer');

// We set the byte length of the nonce
const nonceByteLength = 4;
// We set the max value of the nonce
const nonceMax = Math.pow(2, nonceByteLength * 8);

// Las bytes to compare
const lastByte1 = parseInt('fe', 16);           // ...----------fe
const lastByte2 = parseInt('ca', 16);           // ...--------ca--

// Creates a possible nonce of length nonceByteLength
let nonce = new Buffer.alloc(nonceByteLength);  // 00000000

// If it has one argument...
if (process.argv.length >= 3) {
  // We read the input argument as an hexadecimal number
  // For example: 129df964b701d0b8e72fe7224cc71643cf8e000d122e72f742747708f5e3bb6294c619604e52dcd8f5446da7e9ff7459d1d3cefbcc231dd4c02730a22af9880c
  let input = Buffer.from(process.argv[2], 'hex');

  let hasSolution = false;
  let i = 0;
  // While we don't arrive to nonceMax and while we don't find a solution...
  while ((i < nonceMax) && !hasSolution) {
    // We calculate SHA256 hash of the nonce prefix combined with the original string of bytes input
    let buffer = Buffer.concat([nonce, input]);
    let hash = crypto.createHash('sha256').update(buffer).digest('hex');
    let hashBuffer = Buffer.from(hash, 'hex');
    
    // If the SHA256 has two last bytes as 0xca, 0xfe, we have found the solution
    if ((hashBuffer[hashBuffer.length-1]==lastByte1) && 
        (hashBuffer[hashBuffer.length-2]==lastByte2)) {
      hasSolution = true;

      console.log(`Solution for the given 64-byte string: ${input.toString('hex')}`);
      console.log('----------------------------------------------------------------');
      console.log(hashBuffer.toString('hex'));
      console.log(nonce.toString('hex'));
    }
    // If don't, we try the next nonce number
    inc(nonce);
  }
  if (!hasSolution) {
    console.log('ERROR: This input byte string has no solution')
  }
} else {
  console.log('ERROR: incorrect number of parameters. Usage: <npm start byte_string>');
}



