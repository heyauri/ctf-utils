/**
 * Type definitions for solver modules
 */

/**
 * Solver module types
 */
export interface SolverModules {
  Crypto: any;
  Exploitation: any;
  Math: any;
  Forensics: any;
  Web: any;
  Utils: any;
  Analysis: any;
  ReverseEngineering: any;
}

/**
 * Base interface for all solver tools
 */
export interface SolverTool {
  name: string;
  description: string;
  run: (...args: any[]) => Promise<any>;
}

/**
 * Interface for crypto solver tools
 */
export interface CryptoSolverTool extends SolverTool {
  algorithm: string;
  supportsAttack: boolean;
}

/**
 * Interface for exploitation solver tools
 */
export interface ExploitationSolverTool extends SolverTool {
  vulnerabilityType: string;
  platform: string;
}

/**
 * Interface for forensics solver tools
 */
export interface ForensicsSolverTool extends SolverTool {
  evidenceType: string;
  analysisDepth: 'basic' | 'advanced';
}

/**
 * Interface for web solver tools
 */
export interface WebSolverTool extends SolverTool {
  webTechnology: string;
  securityFocus: boolean;
}

/**
 * Interface for reverse engineering solver tools
 */
export interface ReverseEngineeringSolverTool extends SolverTool {
  binaryFormat: string;
  analysisType: 'static' | 'dynamic';
}

/**
 * Interface for math solver tools
 */
export interface MathSolverTool extends SolverTool {
  mathDomain: string;
  complexity: 'easy' | 'medium' | 'hard';
}

/**
 * Interface for analysis solver tools
 */
export interface AnalysisSolverTool extends SolverTool {
  analysisMethod: string;
  dataType: string;
}

/**
 * Interface for utility solver tools
 */
export interface UtilsSolverTool extends SolverTool {
  utilityType: string;
  useCase: string;
}
