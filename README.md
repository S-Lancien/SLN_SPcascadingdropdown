SLN-SPcascadingdropdown : COM Cascading dropdown utility for SharePoint 2010
============================================================================

Overview
--------
SPcascadingdropdown is a Javascript utility which allows you to create Cascade DropDownlists for SharePoint 2010 using the COM(Client Object Model).
All you need is jQuery (tested with version 1.10.2).
Multiple levels of Cascade DropdownLists can be used.


Here is a little sample :

```
<script type="text/javascript" src="../javascript/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="../javascipt/SLN_SPcascadingdropdown.js"></script> 
 
<script type="text/javascript"> 
$(document).ready(function() {
    $('#countries').SLN_SPcascadingdropdown(
    {
        relationshipList: "Cities",
        relationshipParentList : "Countries",
        relationshipParentListColumn : "Title",
        relationshipListChildColumn : "Title",
        relationshipListParentColumn : "Country",
        childdropdown : "cities",
		autoFillParentDropDownList: true,
		defaulFillChildDropDownList: true,
		promptText: "-- Sélectionner Anomalie --"
    });
});
</script>
 
<select id="countries">
</select>
<select id="cities">
</select>

```

Full details and documentation can be found on the project page here:

<http://sylvainlancien.blogspot.fr/>

This script was inspired by [Anita Boerboom](http://www.itidea.nl)'s script that was working well but :
- The SPServices library was required (compatiblity problems with new versions of jQuery).
- Can't use more than 2 connected cascade DroDownLists.


[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/d9e9fc108b85ef89354e0b8ab6f262d4 "githalytics.com")](http://githalytics.com/S-Lancien/SLN-SPcascadingdropdown)
