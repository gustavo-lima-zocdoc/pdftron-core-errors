import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);
  const [controller,setController] = useState({
    insertTextField: ()=>{},
    insertCheckboxField: ()=>{},
    selectToolbarGroupForms: ()=>{},
  })

  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/PDFTRON_about.pdf',
      },
      viewer.current,
    ).then((instance) => {
      const { documentViewer, annotationManager, Annotations } = instance.Core;

      documentViewer.addEventListener('documentLoaded', () => {
        
        function insertProgrammaticallyTextField(){
          // set flags for multiline and required
          const flags = new Annotations.WidgetFlags();
          flags.set('Multiline', true);
          flags.set('Required', true);
          flags.set('Edit', true);

          // create a form field
          const field = new Annotations.Forms.Field("some text field name", {
            type: 'Tx',
            defaultValue: "some placeholder default text value",
            flags,
          });

          // create a widget annotation
          const widgetAnnot = new Annotations.TextWidgetAnnotation(field);

          // set position and size
          widgetAnnot.PageNumber = 1;
          widgetAnnot.X = 100;
          widgetAnnot.Y = 100;
          widgetAnnot.Width = 50;
          widgetAnnot.Height = 20;

          //add the form field and widget annotation
          annotationManager.addAnnotation(widgetAnnot);
          annotationManager.drawAnnotationsFromList([widgetAnnot]);
          annotationManager.getFieldManager().addField(field);
        }
        setController(baseController=>({
          ...baseController,
          insertTextField: insertProgrammaticallyTextField
        }));

        function insertProgrammaticallyCheckboxField(){
          // set flags for required and edit
          const flags = new Annotations.WidgetFlags();
          flags.set('Required', true);
          flags.set('Edit', true);
      
          // set font type
          const font = new Annotations.Font({ name: 'Helvetica' });
      
          // create a form field
          const field = new Annotations.Forms.Field("some checkbox field name", {
            type: 'Btn',
            value: 'Off',
            flags,
            font: font,
          });
      
          // create a widget annotation
          // caption options are:
          // "4" = Tick
          // "l" = Circle
          // "8" = Cross
          // "u" = Diamond
          // "n" = Square
          // "H" = Star
          // "" = Check
          const widgetAnnot = new Annotations.CheckButtonWidgetAnnotation(field, {
            appearance: 'Off',
            appearances: {
              Off: {},
              Yes: {},
            },
            captions: {
              Normal: "" // Check
            }
          });
      
          // set position and size
          widgetAnnot.PageNumber = 1;
          widgetAnnot.X = 100;
          widgetAnnot.Y = 150;
          widgetAnnot.Width = 50;
          widgetAnnot.Height = 20;
      
          //add the form field and widget annotation
          annotationManager.addAnnotation(widgetAnnot);
          annotationManager.drawAnnotationsFromList([widgetAnnot]);
          annotationManager.getFieldManager().addField(field);
        }
        setController(baseController=>({
          ...baseController,
          insertCheckboxField: insertProgrammaticallyCheckboxField
        }));

        function selectToolbarGroupForms(){
          instance.UI.setToolbarGroup('toolbarGroup-Forms');
        }
        setController(baseController=>({
          ...baseController,
          selectToolbarGroupForms: selectToolbarGroupForms
        }));

      });
    });
  }, []);

  return (
    <div className="App">
      <div className="sidebar">
        <h1>Errors</h1>
        <p><em>How to simulate errors?</em></p>

        <h2>1. Can't edit Text Field:</h2>
        <p><em>Text field can't be edited after programmatically inserted (ref.: <a href="https://www.pdftron.com/documentation/web/guides/forms/create-text-field/" target="_blank" rel="noopener noreferrer">Link</a>)</em></p>
        <p>1.1. Insert programatically:</p>
        click: <button type="button" onClick={controller.insertTextField}>Insert TextField</button><br />
        click: <button type="button" onClick={controller.insertCheckboxField}>Insert CheckboxField</button>
        <p>1.2. Select the toolbar group Forms to edit the fields:</p>
        click: <button type="button" onClick={controller.selectToolbarGroupForms}>Select Forms</button>
        <p>1.3. Error is simulated. You can only edit the Checkbox field, but not the Text field.</p>

        <h2>2. Can't add Text/Checkbox Fields on the toolbar group Forms:</h2>
        <p><em>Text/Checkbox field can't be added at toolbar group Forms.</em></p>
        <p>2.1. Reload page:</p>
        click: <a href=".">Reload page.</a>
        <p>2.2. Select the toolbar group Forms to edit the fields:</p>
        click: <button type="button" onClick={controller.selectToolbarGroupForms}>Select Forms</button>
        <p>2.3. Open the console from the browser.</p>
        <p>2.4. Insert programatically:</p>
        click: <button type="button" onClick={controller.insertTextField}>Insert TextField</button><br />
        click: <button type="button" onClick={controller.insertCheckboxField}>Insert CheckboxField</button>
        <p>2.5. Error is simulated. You can see at the console errors thrown by the library.</p>
      </div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
