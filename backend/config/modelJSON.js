var otc_om_data = {
    "tab_name":	"order",
    "name":"Standard Order (OR)- 777855",
    "automated_sales_order":"80",
    "users": "2000",
    "kpis":  [
    {
        "key": "redundant_item_categories",
        "value" : "5"
    },
    {
        "key": "order_changes",
        "value" : "40%"
    },
    {
        "key": "sales_order",
        "value" : "3%"
    },
    {
        "key": "avg_processing_timw",
        "value" : "7 Days"
    },
    {
        "key": "redundant_item_categories",
        "value" : "5"
    },
    {
        "key": "custom_fields_never_used",
        "value" : "20"
    },
    {
        "key": "redundant_item_categories",
        "value" : "5"
    },
    {
        "key": "max_usage_in_sales_org",
        "value" : "50%"
    }

],
    "organizational_analysis" : {
    "sales_org_1000":"50",
        "sales_org_2000":"15",
        "sales_org_3000":"10",
        "sales_org_4000":"25"
},
    "order_functional_header" : {
    "pricing_proc_RVAA01":"70",
        "pricing_proc_RVAA02":"15",
        "pricing_proc_ZPAR01":"10",
        "pricing_proc_ZTXT001":"25"
},
    "item_category" : {
    "standard_items":"63%",
        "configurable_material_in_sales_documents":"3%",
        "make_to_order_processing":"8%",
        "third_party_processing":"7%"
},
    "preceding_document " : {
    "no_preceding_document":"70",
        "refer_to_quotation_type_ZQT":"20",
        "refer_to_contract_type_CT":"10"
},
    "Subsequent_doc_1":{
    "standard_delivery_LF":"600000",
        "PR":"3425"
},
    "Subsequent_doc_2":{
    "standard_billing_F2":"600000"
}

}


/*-----------------------------------------------------------------------------------------------------------------------*/


var otc_overview_order_management = {
    "cust_id" : "001",
    "industry" : "cpg",
    "document_id":"otc_overview_order_management",
    "lob" : "otc",
    "menu" : "overview",	        // Order_TO_CASH  //Presales
    "tab" : "order_management",     // Presales  // Inquiry


    "total_sales_doc":{
        "label" : "Total Sales Docs",
        "value" : "1.23M",
        "absolute_value" : "1230000",
        "info" : "for Last 1 yr",
        "color" : "color-green"
    },
    "automated_orders" : {
        "label" : "Automated Orders",
        "value" : "60",
        "value_unit" : "%",
        "info" : "",
        "color" : "color-orange"

    },
    "orders" : {
        "label" : "Orders",
        "value" : "60",
        "value_unit" : "%",
        "info" : "",
        "color" : "color-green"

    },
    "pricing_changes" : {
        "label" : "Pricing Changes",
        "value" : "30",
        "value_unit" : "%",
        "info" : "Manually",
        "color" : "color-red"

    },
    "credit_blocks" : {
        "label" : "Credit Blocks",
        "value" : "20",
        "value_unit" : "%",
        "info" : "Orders",
        "color" : "color-orange"

    },
    "customization" : {
        "label" : "Customization",
        "value" : "10",
        "value_unit" : "%",
        "info" : "",
        "color" : "color-green"

    },
    "incomplete_orders" : {
        "label" : "Incomplete Orders",
        "value" : "20",
        "value_unit" : "%",
        "info" : "",
        "color" : "color-red"

    },
    "quotation_to_order" : {
        "label" : "Quotation to Order",
        "value" : "30",
        "value_unit" : "%",
        "info" : "Conversion Rate",
        "color" : "color-green"

    },
    "digitization" : {
        "label" : "Digitization",
        "value" : "70",
        "value_unit" : "%",
        "info" : "",
        "color" : "color-green"

    },

    "chart_order_volume" :{

        "label" : ["Order", "Inquiry", "Quotation", "Scheduling Agreement", "Sch. Agreement with external service", "Contract", "Order w/o Charge", "Debit Memo Request", "Master Contract", "Ind. Requirement Plan"],
        "value" : [56.78, 28.79, 6.54, 5.85, 1.01, 0.24, 0.18, 0.16, 0, 0],
        "value_unit" : "%"
    },

    "chart_customization" : {

        "label": ["Reports", "Interfaces", "Conversions", "Enhancements", "Forms"],
        "value": [21, 5, 15, 9, 12],
        "value_unit" : "",
        "data_collection" : "custom_objects"

    },

    "chart_order_output" : {

        "label": ["Print Output", "EDI Output", "External Send Output"],
        "value": [60, 20, 20],
        "value_unit" : "%",
        "data_collection" : "order_output"

    },

    "panel_integration" : {

        "web_portal":{
            "active" : true,
            "label" : "Web Portal",
            "value" : "",
            "info" : "for Orders",
            "color" : ""
        },
        "sabrix":{
            "active" : true,
            "label" : "Sabrix",
            "value" : "",
            "info" : "for Orders",
            "color" : ""
        },
        "edi" : {
            "active" : true,
            "label" : "EDI",
            "value" : "",
            "info" : "for Sch. Agreements",
            "color" : ""
        }
    },


    "panel_user_exits" : {

        "number_range":{
            "active" : true,
            "label" : "Number Range",
            "value" : "12",
            "info" : "",
            "color" : ""
        },
        "field_modification":{
            "active" : true,
            "label" : "Field Modification",
            "value" : "34",
            "info" : "",
            "color" : ""
        },
        "pricing" : {
            "active" : true,
            "label" : "Pricing",
            "value" : "3",
            "info" : "",
            "color" : ""
        },
        "mat_det_new_fields" : {
            "active" : true,
            "label" : "Material Det. New Fields",
            "value" : "6",
            "info" : "",
            "color" : ""
        },
        "checks_while_saving" : {
            "active" : true,
            "label" : "Checks while Saving",
            "value" : "10",
            "info" : "",
            "color" : ""
        }
    }


}



/*---------------------------------------------------------------------------------------------------------------------*/




var otc_overview_presales_processing = {
    "cust_id" : "001",
    "industry" : "cpg",
    "document_id":"otc_overview_presales_processing",
    "lob" : "otc",
    "menu" : "overview",
    "tab" : "presales_processing",


    "total_sales_doc":{
        "label" : "Total Sales Docs",
        "value" : "0.10M",
        "absolute_value" : "100000",
        "info" : "",
        "color" : "color-green"
    },
    "automated_orders" : {
        "label" : "Automated Orders",
        "value" : "60",
        "value_unit" : "%",
        "info" : "",
        "color" : "color-orange"

    },

    "chart_order_volume" :{

        "label" : ["Inquiry", "Quotation"],
        "value" : [29.7],
        "value_unit" : "%"
    },

    "chart_customization" : {

        "label": ["Reports", "Interfaces", "Conversions", "Enhancements", "Forms"],
        "value": [21, 5, 15, 9, 12],
        "value_unit" : "",
        "data_collection" : "custom_objects"

    },

    "chart_order_output" : {

        "label": ["Print Output", "EDI Output", "External Send Output"],
        "value": [60, 20, 20],
        "value_unit" : "%",
        "data_collection" : "order_output"

    },

    "panel_integration" : {

        "web_portal":{
            "active" : true,
            "label" : "Web Portal",
            "value" : "",
            "info" : "for Orders",
            "color" : ""
        },
        "sabrix":{
            "active" : false,
            "label" : "Sabrix",
            "value" : "",
            "info" : "for Orders",
            "color" : ""
        },
        "edi" : {
            "active" : false,
            "label" : "EDI",
            "value" : "",
            "info" : "for Sch. Agreements",
            "color" : ""
        }
    }


}


/*--------------------------------------------------------------------------------------------------------------------*/



var otc_overview_presales_processing = {
    "cust_id" : "001",
    "industry" : "cpg",
    "document_id":"otc_order_management_order",
    "lob" : "otc",
    "menu" : "order_management",
    "tab" : "order",

    "element":"Standard Order (OR)- 777855",

    "automated_orders" : {
        "label" : "Automated Orders",
        "value" : "80",
        "value_unit" : "%",
        "info" : "",
        "color" : "color-blue"
    },

    "users" : {
        "label" : "Users",
        "value" : "2000",
        "value_unit" : "",
        "info" : "",
        "color" : "color-blue"

    },
    "redundant_item_categories" : {
        "label" : "Redundant Item Categories",
        "value" : "5",
        "value_unit" : "",
        "info" : "only 5 used out of 15",
        "color" : "color-red"

    },
    "order_changes" : {
        "label" : "Order Changes",
        "value" : "40",
        "value_unit" : "%",
        "info" : "Manually",
        "color" : "color-orange"

    },
    "sales_order" : {
        "label" : "Sales Order",
        "value" : "3",
        "value_unit" : "%",
        "info" : "Never Processed",
        "color" : "color-red"

    },
    "avg_processing_time" : {
        "label" : "Avg Processing Time",
        "value" : "7",
        "value_unit" : "days",
        "info" : "Order To Delivery",
        "color" : "color-green"

    },
    "custom_fields_never_used" : {
        "label" : "Custom Fields never used",
        "value" : "20",
        "value_unit" : "",
        "info" : "10 Never populated",
        "color" : "color-red"
    },
    "max_usage_in_sales_org" : {
        "label" : "Max usage in Sales Org",
        "value" : "50",
        "value_unit" : "%",
        "info" : "Sales Org 1000",
        "color" : "color-blue"
    },
    "interface_with_web_portal" : {
        "label" : "Interface with Web Portal",
        "value" : "20",
        "value_unit" : "%",
        "info" : "Out of Total Orders",
        "color" : "color-blue"
    },
    "unique_customers" : {
        "label" : "Unique Customers",
        "value" : "600",
        "value_unit" : "",
        "info" : "In Analysis Period",
        "color" : "color-blue"
    },
    "unique_materials" : {
        "label" : "Unique Materials",
        "value" : "500",
        "value_unit" : "",
        "info" : "In Analysis Period",
        "color" : "color-blue"
    },


    "chart_order_functionality_(HEADER)" :{

        "label" : ["Pricing Proc RVAA01", "Pricing Proc RVAA02","Partner Proc ZPAR01","Text Proc ZTXT001"],
        "value" :[70,30,100,100],
        "value_unit" : "%"
    },

    "chart_organizational_analysis" : {

        "label": ["Sales Org 1000", "Sales Org 2000", "Sales Org 3000", "Sales Org 4000"],
        "value": [50, 15, 10, 15],
        "value_unit" : "",
        "data_collection" : "org_analysis"
    },

    "chart_preceding_document" : {

        "label": ["No Preceding Doc", "Ref To Quotation Type ZOT", "Ref To Contract Type CT"],
        "value": [70, 20, 10],
        "value_unit" : "%",
        "data_collection" : "preceding_docs"
    },

    "panel_item_category" : {

        "standard_items":{
            "active" : true,
            "label" : "Standard Items",
            "value" : "63%",
            "info" : "",
            "color" : "color-red"
        },
        "config_materials":{
            "active" : true,
            "label" : "Configurable Materials In Sales Documents",
            "value" : "3%",
            "info" : "",
            "color" : "color-red"
        },
        "consignment_stock_processing":{
            "active" : true,
            "label" : "Consignment Stock Processing",
            "value" : "12%",
            "info" : "",
            "color" : "color-red"
        },
        "make_to_order_processing":{
            "active" : true,
            "label" : "Make to Order Processing",
            "value" : "8%",
            "info" : "",
            "color" : "color-red"
        },
        "third_party_processing":{
            "active" : true,
            "label" : "Third Party Processing\n",
            "value" : "7%",
            "info" : "",
            "color" : "color-red"
        },
    },
    "panel_SUBSEQUENT_DOC_1" : {

        "standard_delivery_lf":{
            "active" : true,
            "label" : "Std. Delivery LF",
            "value" : "600000",
            "info" : "",
            "color" : "color-blue"
        },
        "pr":{
            "active" : true,
            "label" : "PR",
            "value" : "3425",
            "info" : "",
            "color" : "color-blue"
        }

    },
    "panel_SUBSEQUENT_DOC_2" : {

        "standard_billing_f2":{
            "active" : true,
            "label" : "Standard Billing F2",
            "value" : "600000",
            "info" : "",
            "color" : "color-blue"
        }
    }

}

var otc_overview_presales_processing = {
    "cust_id" : "001",
    "industry" : "cpg",
    "document_id":"otc_order_management_order",
    "lob" : "otc",
    "menu" : "order_management",
    "tab" : "order",

    "element":"Standard Order (OR)- 777866",

    "automated_orders" : {
        "label" : "Automated Orders",
        "value" : "60",
        "value_unit" : "%",
        "info" : "",
        "color" : "color-blue"
    },

    "users" : {
        "label" : "Users",
        "value" : "1000",
        "value_unit" : "",
        "info" : "",
        "color" : "color-blue"

    },
    "redundant_item_categories" : {
        "label" : "Redundant Item Categories",
        "value" : "8",
        "value_unit" : "",
        "info" : "only 8 used out of 15",
        "color" : "color-green"

    },
    "order_changes" : {
        "label" : "Order Changes",
        "value" : "60",
        "value_unit" : "%",
        "info" : "Manually",
        "color" : "color-orange"

    },
    "sales_order" : {
        "label" : "Sales Order",
        "value" : "6",
        "value_unit" : "%",
        "info" : "Never Processed",
        "color" : "color-red"

    },
    "avg_processing_time" : {
        "label" : "Avg Processing Time",
        "value" : "11",
        "value_unit" : "days",
        "info" : "Order To Delivery",
        "color" : "color-green"

    },
    "custom_fields_never_used" : {
        "label" : "Custom Fields never used",
        "value" : "12",
        "value_unit" : "",
        "info" : "10 Never populated",
        "color" : "color-red"
    },
    "max_usage_in_sales_org" : {
        "label" : "Max usage in Sales Org",
        "value" : "50",
        "value_unit" : "%",
        "info" : "Sales Org 1000",
        "color" : "color-blue"
    },
    "interface_with_web_portal" : {
        "label" : "Interface with Web Portal",
        "value" : "20",
        "value_unit" : "%",
        "info" : "Out of Total Orders",
        "color" : "color-blue"
    },
    "unique_customers" : {
        "label" : "Unique Customers",
        "value" : "500",
        "value_unit" : "",
        "info" : "In Analysis Period",
        "color" : "color-blue"
    },
    "unique_materials" : {
        "label" : "Unique Materials",
        "value" : "500",
        "value_unit" : "",
        "info" : "In Analysis Period",
        "color" : "color-blue"
    },


    "chart_order_functionality_(HEADER)" :{

        "label" : ["Pricing Proc RVAA01", "Pricing Proc RVAA02","Partner Proc ZPAR01","Text Proc ZTXT001"],
        "value" :[40,60,80,100],
        "value_unit" : "%"
    },

    "chart_organizational_analysis" : {

        "label": ["Sales Org 1000", "Sales Org 2000", "Sales Org 3000", "Sales Org 4000"],
        "value": [50, 15, 10, 15],
        "value_unit" : "",
        "data_collection" : "org_analysis"
    },

    "chart_preceding_document" : {

        "label": ["No Preceding Doc", "Ref To Quotation Type ZOT", "Ref To Contract Type CT"],
        "value": [70, 20, 10],
        "value_unit" : "%",
        "data_collection" : "preceding_docs"
    },

    "panel_item_category" : {

        "standard_items":{
            "active" : true,
            "label" : "Standard Items",
            "value" : "63%",
            "info" : "",
            "color" : "color-red"
        },
        "config_materials":{
            "active" : true,
            "label" : "Configurable Materials In Sales Documents",
            "value" : "3%",
            "info" : "",
            "color" : "color-red"
        },
        "consignment_stock_processing":{
            "active" : true,
            "label" : "Consignment Stock Processing",
            "value" : "12%",
            "info" : "",
            "color" : "color-red"
        },
        "make_to_order_processing":{
            "active" : true,
            "label" : "Make to Order Processing",
            "value" : "8%",
            "info" : "",
            "color" : "color-red"
        },
        "third_party_processing":{
            "active" : false,
            "label" : "Third Party Processing\n",
            "value" : "7%",
            "info" : "",
            "color" : "color-red"
        },
    },
    "panel_SUBSEQUENT_DOC_1" : {

        "standard_delivery_lf":{
            "active" : true,
            "label" : "Std. Delivery LF",
            "value" : "600000",
            "info" : "",
            "color" : "color-blue"
        },
        "pr":{
            "active" : true,
            "label" : "PR",
            "value" : "3425",
            "info" : "",
            "color" : "color-blue"
        }

    },
    "panel_SUBSEQUENT_DOC_2" : {

        "standard_billing_f2":{
            "active" : true,
            "label" : "Standard Billing F2",
            "value" : "600000",
            "info" : "",
            "color" : "color-blue"
        }
    }

}


 var materials =  [
    {
        "Material_Number": "1001",
        "Material_Desc": "Ipad",
        "Quantity": "10",
        "Price": "20000",
        "Vendor": "Apple",
        "Co._code": "1",
        "Plant": "p001"
    },
        {
            "Material_Number": "1002",
            "Material_Desc": "Dell Inspiron",
            "Quantity": "8",
            "Price": "50000",
            "Vendor": "Dell",
            "Co._code": "2",
            "Plant": "p002"
        },
        {
            "Material_Number": "1003",
            "Material_Desc": "Mobile",
            "Quantity": "10",
            "Price": "10000",
            "Vendor": "Samsung",
            "Co._code": "3",
            "Plant": "p003"
        },
        {
            "Material_Number": "1004",
            "Material_Desc": "Mcbook Air",
            "Quantity": "10",
            "Price": "80000",
            "Vendor": "Apple",
            "Co._code": "1",
            "Plant": "p004"
        },
        {
            "Material_Number": "1005",
            "Material_Desc": "Lenovo Lappy",
            "Quantity": "20",
            "Price": "40000",
            "Vendor": "Lenovo",
            "Co._code": "4",
            "Plant": "p005"
        },
        {
            "Material_Number": "1006",
            "Material_Desc": "LCD",
            "Quantity": "10",
            "Price": "20000",
            "Vendor": "Samsung",
            "Co._code": "3",
            "Plant": "p006"
        },
        {
            "Material_Number": "1007",
            "Material_Desc": "Iphone",
            "Quantity": "10",
            "Price": "50000",
            "Vendor": "Apple",
            "Co._code": "1",
            "Plant": "p007"
        },
    ];

db.materialCollection.insertMany(materials)