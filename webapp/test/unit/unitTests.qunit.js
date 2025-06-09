/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"conconcentro/purchases/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
