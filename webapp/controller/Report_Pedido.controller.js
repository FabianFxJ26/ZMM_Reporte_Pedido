sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/export/Spreadsheet"
], (Controller, Filter, FilterOperator, Spreadsheet) => {
    "use strict";

    return Controller.extend("conconcentro.purchases.controller.Report_Pedido", {
        onInit() {
            const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YY1_REPORTE_ENTRADAS_PEDID_CDS/", {
                json: true,
                useBatch: false
            });
            this.getView().setModel(oModel);
        },

        onSearch() {
            const oView = this.getView();
            const sProveedor = oView.byId("searchField").getValue();
            const sPedido = oView.byId("inputPedido").getValue();
            const sElementoPEP = oView.byId("inputElementoPEP").getValue();

            const aFilters = [];
            const aSupplierOnlyFilters = [];

            if (sProveedor) {
                const oFilterSupplier = new Filter("Supplier", FilterOperator.Contains, sProveedor);
                aFilters.push(oFilterSupplier);
                aSupplierOnlyFilters.push(oFilterSupplier);
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

            this._calcularTotal(aFilters, "/YY1_REPORTE_ENTRADAS_PEDID", "EffectiveAmount", "effectiveAmountPurchaseOrder");
            this._calcularTotal(aSupplierOnlyFilters, "/YY1_REPORTE_ENTRADAS_PEDID", "EffectiveAmount", "effectiveAmountSupplier");
        },

        _calcularTotal(aFilters, sPath, sField, sControlId) {
            const oModel = this.getView().getModel();
            if (!oModel) return;

            oModel.read(sPath, {
                filters: aFilters,
                success: (oData) => {
                    const fTotal = oData.results.reduce((sum, item) => sum + (parseFloat(item[sField]) || 0), 0);
                    this.getView().byId(sControlId).setText(fTotal.toFixed(2));
                },
                error: () => {
                    this.getView().byId(sControlId).setText("0.00");
                }
            });
        },

        onClearFilters() {
            const oView = this.getView();
            oView.byId("searchField").setValue("");
            oView.byId("inputPedido").setValue("");
            oView.byId("inputElementoPEP").setValue("");

            const oTable = oView.byId("reportTable");
            const oBinding = oTable.getBinding("items");
            oBinding.filter([]);

            oView.byId("effectiveAmountPurchaseOrder").setText("0.00");
            oView.byId("effectiveAmountSupplier").setText("0.00");
        },

        onExport() {
            const oModel = this.getView().getModel();
            if (!oModel) return;

            oModel.read("/YY1_REPORTE_ENTRADAS_PEDID", {
                success: (oData) => {
                    const aCols = this._createColumnConfig();
                    const oExportSettings = {
                        workbook: { columns: aCols },
                        dataSource: oData.results,
                        fileName: "ReporteEntradasPedidos.xlsx",
                        worker: false
                    };
                    const oSpreadsheet = new Spreadsheet(oExportSettings);
                    oSpreadsheet.build().finally(() => oSpreadsheet.destroy());
                },
                error: () => {
                    sap.m.MessageToast.show("Error al cargar datos para exportar");
                }
            });
        },

        _createColumnConfig() {
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
        },

        onPedidoPress(oEvent) {
            const sPurchaseOrder = oEvent.getSource().getText();
            const sUrl = `https://my418453.s4hana.cloud.sap/ui#PurchaseOrder-manage&/C_PurchaseOrderTP(PurchaseOrder='${encodeURIComponent(sPurchaseOrder)}',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)/?sap-iapp-state--history=TASZ5AJSLBXW5GY8TJKW74FYJNRXTJLMQRWNSSDS3O`;
            window.open(sUrl, "_blank");
        }
    });
});
