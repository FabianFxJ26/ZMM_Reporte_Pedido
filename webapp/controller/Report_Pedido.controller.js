sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("conconcentro.purchases.controller.Report_Pedido", {
        onInit() {
            var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YY1_REPORTE_ENTRADAS_PEDID_CDS/", {
                json: true,
                useBatch: false
              });
              this.getView().setModel(oModel);
        }
    });
});