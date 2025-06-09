/*global QUnit*/

sap.ui.define([
	"conconcentro/purchases/controller/Report_Pedido.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Report_Pedido Controller");

	QUnit.test("I should test the Report_Pedido controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
