/**
 * Solver modules for CTF challenges
 * 
 * This module exports various solver utilities for different types of CTF challenges:
 * - RSA: RSA cryptography tools and attacks
 * - Exploitation: Binary exploitation utilities
 * - Math: Mathematical utilities for number theory and combinatorics
 * - Forensics: Digital forensics tools
 * - Web: HTTP analysis and web security tools
 * - Utils: General utility functions
 * - Analysis: Cryptanalysis tools
 * - ReverseEngineering: Binary analysis and control flow analysis
 */

import * as Crypto from "./Crypto";
import * as Exploitation from "./Exploitation";
import * as Math from "./Math";
import * as Forensics from "./Forensics";
import * as Web from "./Web";
import * as Utils from "./Utils";
import * as Analysis from "./Analysis";
import * as ReverseEngineering from "./ReverseEngineering";
import * as Types from "./types";

/**
 * Solver modules namespace
 */
export {
  Crypto,
  Exploitation,
  Math,
  Forensics,
  Web,
  Utils,
  Analysis,
  ReverseEngineering,
  Types
};

/**
 * Default export for solver module
 */
export default {
  Crypto,
  Exploitation,
  Math,
  Forensics,
  Web,
  Utils,
  Analysis,
  ReverseEngineering,
  Types
};