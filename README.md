3 record page components in 1 repo !

## PowerRelatedList

Creates a lightning component for displaying related records on a record detail page.

See AppBuilder/Design for the description of the options.

PowerRelatedList2 has been refactored to have a datatable subcomponent.  You pass it an array of records and a few variables, and you get a sortable datatable.

Query/Filtering is implemented at the PowerRelatedList2 level, not on the datatable itself.

Handles all server-side errors.

## LightningFieldSection

* Drag onto a record detail page.  Pick the fields that are editable, the column quantity you want, etc.
* There's no save button--any change updates the database
* Use the component in AppBuilder for more info
* Handles all server-side errors.
* **Does not respect your permissions**

## LightningHistory

* No inputs--just shows the field name, before, after, timestamp, and who changed it as a table.
* Respects field visibility
* Uses side-scrolling if used in a column too narrow for the table to display (like record detail sidebar)

## FileField
* Goal: for specific required documents, link a document to a field
* upload component for record detail pages
* saves the file as attachment, then chatter contentDocumentVersion
* puts that into a text/url field of your specification

## Subcomponents for your hackery

* LightingDataTable: pass it an array of variables, and you'll get a styled, sortable datatable
* LightningFields: add quick-edit fields to anything with just attributes
* LightningErrorHandlerPRL and its related event, handleCallbackError: handle validation rules, general errors, apex exceptions, dupe blocking, and more!

<a href="https://githubsfdeploy.herokuapp.com">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>



