sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library"

], (Controller, Filter, FilterOperato,Spreadsheet,exportLibrary) => {
    "use strict";

    return Controller.extend("conconcentro.purchases.controller.Report_Pedido", {
        onInit() {
            var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YY1_REPORTE_ENTRADAS_PEDID_CDS/", {
                json: true,
                useBatch: false
              });
              this.getView().setModel(oModel);
        },
        onSearch: function () {
            const oView = this.getView();

            const sProveedor = oView.byId("searchField").getValue();
            const sPedido = oView.byId("inputPedido").getValue();
            const sElementoPEP = oView.byId("inputElementoPEP").getValue();

            const aFilters = [];


            if (sProveedor) {
                aFilters.push(new Filter("Supplier", FilterOperator.Contains, sProveedor));
            }
            if (sPedido) {
                aFilters.push(new Filter("PurchaseOrder", FilterOperator.Contains, sPedido));
            }
            if (sElementoPEP) {
                aFilters.push(new Filter("WBSElementExternalID", FilterOperator.Contains, sElementoPEP));
            }
            const oTable = oView.byId("reportTable");
            const oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },
        onClearFilters: function () {
            const oView = this.getView();
      
         
            oView.byId("searchField").setValue("");
            oView.byId("inputPedido").setValue("");
            oView.byId("inputElementoPEP").setValue("");
      
           
            const oTable = oView.byId("reportTable");
            const oBinding = oTable.getBinding("items");
            oBinding.filter([]);
          },
          onClearFilters: function () {
            const oView = this.getView();
            oView.byId("searchField").setValue("");
            oView.byId("inputPedido").setValue("");
            oView.byId("inputElementoPEP").setValue("");

            const oTable = oView.byId("reportTable");
            const oBinding = oTable.getBinding("items");
            oBinding.filter([]);
        },
        onExport: function () {
            const oTable = this.getView().byId("reportTable");
            const oBinding = oTable.getBinding("items");

            const aCols = this._createColumnConfig();

            const oExportSettings = {
                workbook: {
                    columns: aCols
                },
                dataSource: oBinding.getContexts(0, oBinding.getLength()).map(oContext => oContext.getObject()),
                fileName: "ReporteEntradasPedidos.xlsx",
                worker: false // true si deseas usar un web worker (recomendado en grandes volúmenes)
            };

            const oSpreadsheet = new Spreadsheet(oExportSettings);
            oSpreadsheet.build().finally(() => {
                oSpreadsheet.destroy();
            });
        },

        _createColumnConfig: function () {
            return [
                { label: "Pedido", property: "PurchaseOrder" },
                { label: "Fecha Clave", property: "CreationDate", type: "date" },
                { label: "Proveedor", property: "Supplier" },
                { label: "Nombre del proveedor", property: "SupplierName" },
                { label: "Elemento PEP", property: "WBSElementExternalID" },
                { label: "Nombre del elemento PEP", property: "WBSDescription" },
                { label: "Moneda", property: "DocumentCurrency" },
                { label: "Valor total del pedido con IVA", property: "EffectiveAmount", type: "number" },
                { label: "Valor pendiente por entregar con IVA", property: "ValorPendiente", type: "number" },
                { label: "Valor entregado con IVA", property: "ValorEntregado", type: "number" },
                { label: "Cantidad del pedido", property: "OrderQuantity", type: "number" }
            ];
        }
    });
});