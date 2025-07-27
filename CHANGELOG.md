# [1.16.0](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.15.0...v1.16.0) (2025-04-03)


### Features

* trigger new release ([666721d](https://github.com/aashari/mcp-server-atlassian-confluence/commit/666721d58bd5e5dca4131af382deacb1eb98d0f2))

# [1.15.0](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.14.2...v1.15.0) (2025-04-03)


### Features

* **logging:** add file logging with session ID to ~/.mcp/data/ ([cb1691b](https://github.com/aashari/mcp-server-atlassian-confluence/commit/cb1691b6a735e231eff0a63a34cb9280de81a302))

## [1.14.2](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.14.1...v1.14.2) (2025-04-03)


### Bug Fixes

* **logger:** ensure consistent logger implementation across all projects ([e49e0df](https://github.com/aashari/mcp-server-atlassian-confluence/commit/e49e0df5e9710f386403b17953f8b42525ae212d))

## [1.14.1](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.14.0...v1.14.1) (2025-04-03)


### Performance Improvements

* **confluence:** improve version handling and module exports ([413be54](https://github.com/aashari/mcp-server-atlassian-confluence/commit/413be544774a56196af129159e8647e4f3f27744))

# [1.14.0](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.13.2...v1.14.0) (2025-03-29)


### Bug Fixes

* add NOT_FOUND error type and use createNotFoundError in transport utility ([98ec69b](https://github.com/aashari/mcp-server-atlassian-confluence/commit/98ec69be89158ae08bcfa7cc47043815b16d0bd9))
* **cli:** standardize parameter naming conventions ([8c53d15](https://github.com/aashari/mcp-server-atlassian-confluence/commit/8c53d15fc053ef33c242bbc05a4e662515dc8c74))
* handle api errors in transport tests without mocking ([fe1acf6](https://github.com/aashari/mcp-server-atlassian-confluence/commit/fe1acf6569b7144eea677e1ab1d4d9dce4914ff4))
* make tests work properly without authentication for CI ([37a09bd](https://github.com/aashari/mcp-server-atlassian-confluence/commit/37a09bd9df363cd80373960602cb44aad4f77a46))
* preserve NOT_FOUND error type in error handling flow ([0c9d994](https://github.com/aashari/mcp-server-atlassian-confluence/commit/0c9d994355411191e6a08ab66bd489ecfd10f430))
* properly skip Atlassian Pages tests when credentials are not available ([4e385ad](https://github.com/aashari/mcp-server-atlassian-confluence/commit/4e385ad0c4f613ee04065dab97b0ad008488de06))
* properly skip fetchAtlassian tests when credentials aren't available ([bef0138](https://github.com/aashari/mcp-server-atlassian-confluence/commit/bef01380e78a10cb05ed15ea6f9b1be82073f846))
* properly skip tests when credentials are not available ([9aad033](https://github.com/aashari/mcp-server-atlassian-confluence/commit/9aad033042de9597d2e5c34128ab48d0144f49bb))
* resolve build errors with status imports ([19e7d11](https://github.com/aashari/mcp-server-atlassian-confluence/commit/19e7d1163c47bfc8906e16204b7dba8b0ab4af36))
* resolve TypeScript errors and lint warnings in Confluence MCP server ([a80d463](https://github.com/aashari/mcp-server-atlassian-confluence/commit/a80d46314ea985e8f1089e12b83c5d88701b7a45))
* standardize CLI binary name to mcp-server-atlassian-confluence ([9e55363](https://github.com/aashari/mcp-server-atlassian-confluence/commit/9e5536349f0c8920c0df50f51c0947ddecb0487a))
* standardize sort and array parameters in Confluence CLI ([4f633c5](https://github.com/aashari/mcp-server-atlassian-confluence/commit/4f633c5257f79ebd203166c8aa85a487ac6f06bc))
* **tests:** add mock implementation to eliminate skipped tests ([1075287](https://github.com/aashari/mcp-server-atlassian-confluence/commit/10752872d6e99ebeebd229f2aa00e26a3c89ea74))
* update CLI test expectations to match implementation behavior ([623b048](https://github.com/aashari/mcp-server-atlassian-confluence/commit/623b048616d9beb7915f660eb28241ac5952e93b))
* update page CLI test expectations to handle both local and CI environments ([d2319ce](https://github.com/aashari/mcp-server-atlassian-confluence/commit/d2319ceb560cde065c650c6c40105ae62b3b8985))
* update page CLI test expectations to match implementation ([3128935](https://github.com/aashari/mcp-server-atlassian-confluence/commit/31289353df44be3b2f7f6d56b268b46920359bb4))
* update tests to handle NOT_FOUND errors consistently ([934a490](https://github.com/aashari/mcp-server-atlassian-confluence/commit/934a490ab7e61a0b24f28e51dc1958dda78f0f4c))


### Features

* standardize CLI flag patterns and parameter optionality ([66adb3d](https://github.com/aashari/mcp-server-atlassian-confluence/commit/66adb3dc60b4af1ecbb0327e88fbc8c4e3543e1f))
* **test:** add improved integration tests for Confluence spaces service and controller ([3a502f7](https://github.com/aashari/mcp-server-atlassian-confluence/commit/3a502f792c183dc1d240ba41d8f6d756b67d3b86))

## [1.13.2](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.13.1...v1.13.2) (2025-03-28)


### Bug Fixes

* **markdown:** improve table formatting by consolidating whitespace in cells ([3e917aa](https://github.com/aashari/mcp-server-atlassian-confluence/commit/3e917aa943cf2b14abc5b86df47d97cb214a4eba))

## [1.13.1](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.13.0...v1.13.1) (2025-03-28)


### Performance Improvements

* rename tools to use underscore instead of hyphen ([5ab5861](https://github.com/aashari/mcp-server-atlassian-confluence/commit/5ab5861b3954a286e93afd4522f978885ffced38))

# [1.13.0](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.12.0...v1.13.0) (2025-03-27)


### Bug Fixes

* standardize logger utility exports to enforce contextual logging pattern ([a9e21f3](https://github.com/aashari/mcp-server-atlassian-confluence/commit/a9e21f381589db9ec29c72cacb0bd902d359ccab))
* standardize startup logging messages for better consistency ([4fdb15c](https://github.com/aashari/mcp-server-atlassian-confluence/commit/4fdb15c96cc1aafa11f0145e95f4898e23a9d34c))
* standardize vendor types with other MCP projects ([3c1de7a](https://github.com/aashari/mcp-server-atlassian-confluence/commit/3c1de7a363753aa6a1837deb42290526619ce8aa))
* trigger new release ([341e71e](https://github.com/aashari/mcp-server-atlassian-confluence/commit/341e71e954c07568df8d88bc9c3448c90049a005))
* update applyDefaults utility to work with TypeScript interfaces ([b0fb0a3](https://github.com/aashari/mcp-server-atlassian-confluence/commit/b0fb0a3fc4ce73b1d585e1da827fea0800cdaeb3))
* update version to 1.13.0 to fix CI/CD workflows ([b70bb43](https://github.com/aashari/mcp-server-atlassian-confluence/commit/b70bb43f6627bf01e6bdc69dd3a571f5ad07348e))


### Features

* update to version 1.13.1 with improved space command examples ([ce77e09](https://github.com/aashari/mcp-server-atlassian-confluence/commit/ce77e0994d84e63ad924ec1780f1aa7adbe9bf12))

## [1.12.1](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.12.0...v1.12.1) (2025-03-27)


### Bug Fixes

* standardize logger utility exports to enforce contextual logging pattern ([a9e21f3](https://github.com/aashari/mcp-server-atlassian-confluence/commit/a9e21f381589db9ec29c72cacb0bd902d359ccab))
* standardize startup logging messages for better consistency ([4fdb15c](https://github.com/aashari/mcp-server-atlassian-confluence/commit/4fdb15c96cc1aafa11f0145e95f4898e23a9d34c))
* standardize vendor types with other MCP projects ([3c1de7a](https://github.com/aashari/mcp-server-atlassian-confluence/commit/3c1de7a363753aa6a1837deb42290526619ce8aa))
* trigger new release ([341e71e](https://github.com/aashari/mcp-server-atlassian-confluence/commit/341e71e954c07568df8d88bc9c3448c90049a005))
* update applyDefaults utility to work with TypeScript interfaces ([b0fb0a3](https://github.com/aashari/mcp-server-atlassian-confluence/commit/b0fb0a3fc4ce73b1d585e1da827fea0800cdaeb3))
* update version to 1.13.0 to fix CI/CD workflows ([b70bb43](https://github.com/aashari/mcp-server-atlassian-confluence/commit/b70bb43f6627bf01e6bdc69dd3a571f5ad07348e))

## [1.12.1](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.12.0...v1.12.1) (2025-03-27)


### Bug Fixes

* standardize logger utility exports to enforce contextual logging pattern ([a9e21f3](https://github.com/aashari/mcp-server-atlassian-confluence/commit/a9e21f381589db9ec29c72cacb0bd902d359ccab))
* standardize startup logging messages for better consistency ([4fdb15c](https://github.com/aashari/mcp-server-atlassian-confluence/commit/4fdb15c96cc1aafa11f0145e95f4898e23a9d34c))
* standardize vendor types with other MCP projects ([3c1de7a](https://github.com/aashari/mcp-server-atlassian-confluence/commit/3c1de7a363753aa6a1837deb42290526619ce8aa))
* trigger new release ([341e71e](https://github.com/aashari/mcp-server-atlassian-confluence/commit/341e71e954c07568df8d88bc9c3448c90049a005))
* update applyDefaults utility to work with TypeScript interfaces ([b0fb0a3](https://github.com/aashari/mcp-server-atlassian-confluence/commit/b0fb0a3fc4ce73b1d585e1da827fea0800cdaeb3))

# [1.12.0](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.11.1...v1.12.0) (2025-03-27)


### Bug Fixes

* **error:** standardize error handling across all MCP servers ([a7ad7e3](https://github.com/aashari/mcp-server-atlassian-confluence/commit/a7ad7e39c42d418f760706b3726317376d899d5f))
* improve API test skipping when credentials are missing ([f150985](https://github.com/aashari/mcp-server-atlassian-confluence/commit/f150985c05ce9e8cd2c37d575b071415caad7543))
* **test:** update transport.util.test.ts to handle Logger refactoring ([c9953f4](https://github.com/aashari/mcp-server-atlassian-confluence/commit/c9953f4626b9bbe39357ec9bba3dc4fc0b21642f))


### Features

* **logging:** complete logging standardization across all modules ([dae3f60](https://github.com/aashari/mcp-server-atlassian-confluence/commit/dae3f60e6ec291bdee2cb5ad8f791299327ee420))
* **logging:** enhance logging system with performance metrics, granular debug controls, and operational milestones ([93fde13](https://github.com/aashari/mcp-server-atlassian-confluence/commit/93fde13b1100eba5ec49adf460d25613d419a027))
* **logging:** standardize logger context usage across service modules ([a27cae4](https://github.com/aashari/mcp-server-atlassian-confluence/commit/a27cae42bb66f33052f5bef0b449de2d5741874f))
* **logging:** standardize logging across Confluence modules ([50326ba](https://github.com/aashari/mcp-server-atlassian-confluence/commit/50326ba572ebb827e32d0082baf522b2f9e2c2df))

## [1.11.1](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.11.0...v1.11.1) (2025-03-27)


### Bug Fixes

* trigger release ([2cd8a9d](https://github.com/aashari/mcp-server-atlassian-confluence/commit/2cd8a9dace5610715867ab8a8adffe0da6161001))

# [1.11.0](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.10.0...v1.11.0) (2025-03-27)


### Features

* **confluence:** add default sorting to pages and spaces commands ([a91b5af](https://github.com/aashari/mcp-server-atlassian-confluence/commit/a91b5af4418b2928c538469967c574f96152e3fa))

# [1.10.0](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.9.2...v1.10.0) (2025-03-27)


### Features

* **confluence:** add default sorting to list operations ([3d621c4](https://github.com/aashari/mcp-server-atlassian-confluence/commit/3d621c440985186414e612471227cd0cbe893173))

## [1.9.2](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.9.1...v1.9.2) (2025-03-26)


### Bug Fixes

* improve CLI and tool descriptions with consistent formatting and detailed guidance ([008f2b9](https://github.com/aashari/mcp-server-atlassian-confluence/commit/008f2b9f829de910253a9825669a5c20b609512e))

## [1.9.1](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.9.0...v1.9.1) (2025-03-26)


### Bug Fixes

* support comma-separated list for space-id parameter in list-pages ([3f0aecf](https://github.com/aashari/mcp-server-atlassian-confluence/commit/3f0aecfeb4bedcc86be779104487da99c563203e))

# [1.9.0](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.8.0...v1.9.0) (2025-03-26)


### Features

* trigger release with semantic versioning ([d285293](https://github.com/aashari/mcp-server-atlassian-confluence/commit/d2852939d72c200a4171446578c593e6f588ef96))

# [1.8.0](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.7.0...v1.8.0) (2025-03-26)


### Features

* **page:** remove bodyFormat option to ensure minimal interface ([bf79382](https://github.com/aashari/mcp-server-atlassian-confluence/commit/bf79382f0c84242cca96076cd1b209c22a0cd4b3))

# [1.7.0](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.6.0...v1.7.0) (2025-03-26)


### Features

* standardize CQL queries and clarify text search options ([d405fc5](https://github.com/aashari/mcp-server-atlassian-confluence/commit/d405fc5f7a0381fd329558f5d7b763cd7d97dd0e))

# [1.6.0](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.5.1...v1.6.0) (2025-03-26)


### Features

* enhance pages and spaces CLI with named parameters and improved date handling ([25103de](https://github.com/aashari/mcp-server-atlassian-confluence/commit/25103de54fa91dba532b984c2ea9e85b7a7b6f6f))

## [1.5.1](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.5.0...v1.5.1) (2025-03-25)


### Bug Fixes

* replace any with unknown in defaults.util.ts ([cd70568](https://github.com/aashari/mcp-server-atlassian-confluence/commit/cd70568e4a0ad36b36fd31760da953eba839b43c))

# [1.5.0](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.4.0...v1.5.0) (2025-03-25)


### Features

* **pagination:** standardize pagination display across all CLI commands ([442a449](https://github.com/aashari/mcp-server-atlassian-confluence/commit/442a4495dd07039e3acd74541583645118fbe0cb))

# [1.4.0](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.3.0...v1.4.0) (2025-03-25)


### Features

* **cli:** standardize CLI command descriptions with detailed explanations ([42d11c6](https://github.com/aashari/mcp-server-atlassian-confluence/commit/42d11c6e2670cc3bcc83016ab9d65287454ab1fa))
* **format:** implement standardized formatters and update CLI documentation ([d7aad41](https://github.com/aashari/mcp-server-atlassian-confluence/commit/d7aad41dd9bd7e440b3451c69e508abc310175b7))

# [1.3.0](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.2.5...v1.3.0) (2025-03-25)


### Bug Fixes

* standardize logging patterns and fix linter errors ([74c879f](https://github.com/aashari/mcp-server-atlassian-confluence/commit/74c879f6d7c4caced10ab6121a31e2b286689da7))


### Features

* **pages:** enhance page and space controllers ([ba21a0d](https://github.com/aashari/mcp-server-atlassian-confluence/commit/ba21a0d6b974eedbbf261265290526ca317b550e))

## [1.2.5](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.2.4...v1.2.5) (2025-03-25)


### Bug Fixes

* trigger new release for parameter and pagination standardization ([cc0138a](https://github.com/aashari/mcp-server-atlassian-confluence/commit/cc0138a6ef16d30ef80a4f048a186886ebdfacfb))
* update CLI and tool handlers to use object-based identifiers ([cf6b2ac](https://github.com/aashari/mcp-server-atlassian-confluence/commit/cf6b2ac55b22af12b2cb69e9e0e676168bc8a7b2))

## [1.2.4](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.2.3...v1.2.4) (2025-03-24)


### Bug Fixes

* remove dist directory from git tracking ([7343e65](https://github.com/aashari/mcp-server-atlassian-confluence/commit/7343e65746001cb3465f9d0b0db30297ee43fb09))

## [1.2.3](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.2.2...v1.2.3) (2025-03-24)


### Bug Fixes

* remove dist files from release commit assets ([74e53ce](https://github.com/aashari/mcp-server-atlassian-confluence/commit/74e53cee60c6a7785561354c81cbdf611323df5a))

## [1.2.2](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.2.1...v1.2.2) (2025-03-24)


### Bug Fixes

* version consistency and release workflow improvements ([1a2baae](https://github.com/aashari/mcp-server-atlassian-confluence/commit/1a2baae4326163c8caf4fa4cfeb9f4b8028d2b5a))

## [1.2.1](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.2.0...v1.2.1) (2025-03-24)


### Bug Fixes

* improve documentation with additional section ([6849f9b](https://github.com/aashari/mcp-server-atlassian-confluence/commit/6849f9b2339c049e0017ef40aedadd184350cee0))

# [1.2.0](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.1.0...v1.2.0) (2025-03-24)


### Features

* enhance get-space command to support both numeric IDs and space keys ([2913153](https://github.com/aashari/mcp-server-atlassian-confluence/commit/29131536f302abf1923c0c6521d544c51ad222fa))

# [1.1.0](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.0.1...v1.1.0) (2025-03-23)


### Bug Fixes

* remove incorrect limit expectation in transport utility tests ([6f7b689](https://github.com/aashari/mcp-server-atlassian-confluence/commit/6f7b689a7eb5db8a8592db88e7fa27ac04d641c8))


### Features

* improve development workflow and update documentation ([4458957](https://github.com/aashari/mcp-server-atlassian-confluence/commit/445895777be6287a624cb19b8cd8a12590a28c7b))

## [1.0.1](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.0.0...v1.0.1) (2025-03-23)

### Bug Fixes

- update package name in config loader ([3b8157b](https://github.com/aashari/mcp-server-atlassian-confluence/commit/3b8157b076441e4dde562cddfe31671f3696434d))

# 1.0.0 (2025-03-23)

### Bug Fixes

- add workflows permission to semantic-release workflow ([de3a335](https://github.com/aashari/mcp-server-atlassian-confluence/commit/de3a33510bd447af353444db1fcb58e1b1aa02e4))
- ensure executable permissions for bin script ([395f1dc](https://github.com/aashari/mcp-server-atlassian-confluence/commit/395f1dcb5f3b5efee99048d1b91e3b083e9e544f))
- handle empty strings properly in greet function ([546d3a8](https://github.com/aashari/mcp-server-atlassian-confluence/commit/546d3a84209e1065af46b2213053f589340158df))
- improve error logging with IP address details ([121f516](https://github.com/aashari/mcp-server-atlassian-confluence/commit/121f51655517ddbea7d25968372bd6476f1b3e0f))
- improve GitHub Packages publishing with a more robust approach ([fd2aec9](https://github.com/aashari/mcp-server-atlassian-confluence/commit/fd2aec9926cf99d301cbb2b5f5ca961a6b6fec7e))
- improve GitHub Packages publishing with better error handling and debugging ([db25f04](https://github.com/aashari/mcp-server-atlassian-confluence/commit/db25f04925e884349fcf3ab85316550fde231d1f))
- improve GITHUB_OUTPUT syntax in semantic-release workflow ([6f154bc](https://github.com/aashari/mcp-server-atlassian-confluence/commit/6f154bc43f42475857e9256b0a671c3263dc9708))
- improve version detection for global installations ([97a95dc](https://github.com/aashari/mcp-server-atlassian-confluence/commit/97a95dca61d8cd7a86c81bde4cb38c509b810dc0))
- make publish workflow more resilient against version conflicts ([ffd3705](https://github.com/aashari/mcp-server-atlassian-confluence/commit/ffd3705bc064ee9135402052a0dc7fe32645714b))
- remove invalid workflows permission ([c012e46](https://github.com/aashari/mcp-server-atlassian-confluence/commit/c012e46a29070c8394f7ab596fe7ba68c037d3a3))
- remove type module to fix CommonJS compatibility ([8b1f00c](https://github.com/aashari/mcp-server-atlassian-confluence/commit/8b1f00c37467bc676ad8ec9ab672ba393ed084a9))
- resolve linter errors in version detection code ([5f1f33e](https://github.com/aashari/mcp-server-atlassian-confluence/commit/5f1f33e88ae843b7a0d708899713be36fcd2ec2e))
- update examples to use correct API (greet instead of sayHello) ([7c062ca](https://github.com/aashari/mcp-server-atlassian-confluence/commit/7c062ca42765c659f018f990f4b1ec563d1172d3))
- update release workflow to ensure correct versioning in compiled files ([a365394](https://github.com/aashari/mcp-server-atlassian-confluence/commit/a365394b8596defa33ff5a44583d52e2c43f0aa3))
- update version display in CLI ([2b7846c](https://github.com/aashari/mcp-server-atlassian-confluence/commit/2b7846cbfa023f4b1a8c81ec511370fa8f5aaf33))

### Features

- add automated dependency management ([efa1b62](https://github.com/aashari/mcp-server-atlassian-confluence/commit/efa1b6292e0e9b6efd0d43b40cf7099d50769487))
- add CLI usage examples for both JavaScript and TypeScript ([d5743b0](https://github.com/aashari/mcp-server-atlassian-confluence/commit/d5743b07a6f2afe1c6cb0b03265228cba771e657))
- add support for custom name in greet command ([be48a05](https://github.com/aashari/mcp-server-atlassian-confluence/commit/be48a053834a1d910877864608a5e9942d913367))
- add version update script and fix version display ([ec831d3](https://github.com/aashari/mcp-server-atlassian-confluence/commit/ec831d3a3c966d858c15972365007f9dfd6115b8))
- implement Atlassian Confluence MCP server ([50ee69e](https://github.com/aashari/mcp-server-atlassian-confluence/commit/50ee69e37f4d453cb8f0447e10fa5708a787aa93))
- implement review recommendations ([a23cbc0](https://github.com/aashari/mcp-server-atlassian-confluence/commit/a23cbc0608a07e202396b3cd496c1f2078e304c1))
- implement testing, linting, and semantic versioning ([1d7710d](https://github.com/aashari/mcp-server-atlassian-confluence/commit/1d7710dfa11fd1cb04ba3c604e9a2eb785652394))
- improve CI workflows with standardized Node.js version, caching, and dual publishing ([0dc9470](https://github.com/aashari/mcp-server-atlassian-confluence/commit/0dc94705c81067d7ff63ab978ef9e6a6e3f75784))
- improve package structure and add better examples ([bd66891](https://github.com/aashari/mcp-server-atlassian-confluence/commit/bd668915bde84445161cdbd55ff9da0b0af51944))

### Reverts

- restore simple version handling ([bd0fadf](https://github.com/aashari/mcp-server-atlassian-confluence/commit/bd0fadfa8207b4a7cf472c3b9f4ee63d8e36189d))

# 1.0.0 (2025-03-23)

### Features

- Initial release of Atlassian Confluence MCP server
- Provides tools for accessing and searching Confluence spaces, pages, and content
- Integration with Claude Desktop and Cursor AI via Model Context Protocol
- CLI support for direct interaction with Confluence
