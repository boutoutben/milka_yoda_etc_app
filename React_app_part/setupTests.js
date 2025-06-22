import '@testing-library/jest-dom'; // <-- must be first

import { TextEncoder, TextDecoder } from 'util';


global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;