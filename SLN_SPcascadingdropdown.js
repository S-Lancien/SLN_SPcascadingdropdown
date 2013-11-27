/* Copyright (c) 2013 
* Sylvain Lancien
* http://www.wibami.com
* 30-10-2013
* Tested with jQuery 1.10.2 and SharePoint 2010
*/


(function ($) {
    $.fn.SLN_SPcascadingdropdown = function (options) {

        var defaults = {
            relationshipList: "Cities", //The name of the list which contains the parent/child relationships.
            relationshipParentList: "Countries", //The name of the list which contains the parent items.
            relationshipParentListColumn: "Title", //The StaticName of the values column in the relationshipParentList. 
            relationshipListChildColumn: "Title", //The StaticName of the child column in the relationshipList
            relationshipListParentColumn: "Country", //The StaticName of the parent column in the relationshipList
            childDropDown: "cities", //The id of the child DropDownList
            autoFillParentDropDownList: true, //True : Fill the parent DropDownList with all ParentList values (set false if you want to keep old selected values)
            defaulFillChildDropDownList: false, //True: Fill the child DropDownList with all ChildList values if no value is selected for parent DropDownList.
            promptText: "--Select item--" // The default text displayed in the dropdownlists
        };


        var options = $.extend(defaults, options);

        return this.each(function () {

            //Get the parent Dropdownlist ID
            var parentdropdown = this.id;

            //Get the current client context
            context = SP.ClientContext.get_current();

            //Fill the parent DropDownList with all values
            if (options.autoFillParentDropDownList) {
                fillDefaults(parentdropdown, options.relationshipParentList, options.relationshipParentListColumn, context, options.defaulFillChildDropDownList);
            }
            else if (options.defaulFillChildDropDownList) {
                //Fill the child DropDownList with all values
                fillDefaults(options.childDropDown, options.relationshipList, options.relationshipListChildColumn, context, false);
            }

            $('#' + options.childDropDown).append("<option value='0' selected='true'>" + options.promptText + "</option>");

            $('select').change(function (e) {
                if (this.id == parentdropdown) {
                    var childList = context.get_web().get_lists().getByTitle(options.relationshipList);

                    //Clear the child Dropdownlist
                    $('#' + options.childDropDown).empty();
                    $('#' + options.childDropDown).append("<option value='0' selected='true'>" + options.promptText + "</option>");

                    if (this[this.selectedIndex].value != null && this[this.selectedIndex].value != 0) {
                        itemSelected = this[this.selectedIndex].text;
                        var camlQuery = new SP.CamlQuery();

                        camlQuery.set_viewXml("<View><Query><Where><Eq><FieldRef Name='" + options.relationshipListParentColumn + "'/>" + "<Value Type='Lookup'>" + itemSelected + "</Value></Eq></Where><OrderBy><FieldRef Name='" + options.relationshipListChildColumn + "' Ascending='True' /></OrderBy></Query><RowLimit>10</RowLimit></View>");
                        var childListItems = childList.getItems(camlQuery);
                        context.load(childListItems);
                        context.executeQueryAsync(Function.createDelegate(this, function () { ReadListItemSucceeded("#" + options.childDropDown, options.relationshipListChildColumn, childListItems, false); }), ReadListItemFailed);
                    }
                    else {
                        if (options.defaulFillChildDropDownList) {
                            //Fill the child DropDownList with all values
                            fillDefaults(options.childDropDown, options.relationshipList, options.relationshipListChildColumn, context, false);
                        }
                        else {
                            $('#' + options.childDropDown).empty();
                            $('#' + options.childDropDown).append("<option value='0' selected='true'>" + options.promptText + "</option>");
                        }
                    }
                    $('#' + options.childDropDown).change();
                }
            });


            function fillDefaults(dropdownName, listName, columnName, context, fillChildDropdown) {
                var spList = context.get_web().get_lists().getByTitle(listName);
                var camlQuery = SP.CamlQuery.createAllItemsQuery();
                this.listItems3 = spList.getItems(camlQuery);
                context.load(listItems3);
                context.executeQueryAsync(Function.createDelegate(this, function () { ReadListItemSucceeded("#" + dropdownName, columnName, listItems3, fillChildDropdown); }), ReadListItemFailed);
            }

            
            //executeQueryAsync Succeed
            function ReadListItemSucceeded(dropdownID, columnName, listItems, fillChildDropdown) {
                var enumerator = listItems.getEnumerator();

                //Clear the current DropDownList
                $(dropdownID).empty();

                while (enumerator.moveNext()) {
                    var listItem = enumerator.get_current();
                    $(dropdownID).append('<option value="' + listItem.get_id().toString() + '">' + listItem.get_item(columnName) + '</option>');
                }

                //Add the promptext as first option and select it
                $(dropdownID).prepend("<option value='0' selected='true'>" + options.promptText + "</option>");
                $(dropdownID).find("option:first")[0].selected = true;

                //Fill the child DropDownList with all values : We needed to wait for the executeQueryAsync to finish
                if (fillChildDropdown) {                    
                    fillDefaults(options.childDropDown, options.relationshipList, options.relationshipListChildColumn, context, false);
                }
            }


            //executeQueryAsync Failed
            function ReadListItemFailed(sender, args) {
                alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            }

        });

    };
})(jQuery);