/* eslint-disable @typescript-eslint/no-unused-vars */
/*---------------------------------------------------------
 * Copyright 2020 The Go Authors. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/

'use strict';

import assert from 'assert';
import { applyCodeCoverageToAllEditors, coverageFilesForTest, initForTest } from '../../src/goCover';
import { updateGoVarsFromConfig } from '../../src/goInstallTools';
import fs = require('fs-extra');
import path = require('path');
import sinon = require('sinon');
import vscode = require('vscode');

// The ideal test would check that each open editor containing a file with coverage
// information is displayed correctly. We cannot see the applied decorations, so the
// test checks that the cover.out file has been read correctly, and the import paths
// have been correctly converted to file system paths, which are what vscode uses.
suite('Coverage for tests', function () {
	this.timeout(10000);

	let fixtureSourcePath: string;
	let coverFilePath: string;

	suiteSetup(async () => {
		await updateGoVarsFromConfig();

		// Set up the test fixtures.
		fixtureSourcePath = path.join(__dirname, '..', '..', '..', 'test', 'testdata', 'coverage');
		coverFilePath = path.join(fixtureSourcePath, 'cover.out');
		return;
	});
	test('resolve import paths', async () => {
		initForTest();
		const x = vscode.workspace.openTextDocument(coverFilePath);
		await applyCodeCoverageToAllEditors(coverFilePath, fixtureSourcePath);
		const files = Object.keys(coverageFilesForTest());
		const aDotGo = files.includes(path.join(fixtureSourcePath, 'a', 'a.go'));
		const bDotGo = files.includes(path.join(fixtureSourcePath, 'b', 'b.go'));
		assert.equal(aDotGo && bDotGo, true, `seen a.go:${aDotGo}, seen b.go:${bDotGo}\n${files}\n`);
	});
});
