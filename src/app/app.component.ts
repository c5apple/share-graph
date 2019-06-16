import { Component } from '@angular/core';
import { HotTableRegisterer } from '@handsontable/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private hotRegisterer = new HotTableRegisterer();

  id = 'my-custom-id';

  hotSettings: Handsontable.GridSettings = {
    data: [
      { id: 1, 'name.first': 'Ted', 'name.last': 'Right' },
      { id: 2, 'name.first': 'Frank', 'name.last': 'Honest' },
      { id: 3, 'name.first': 'Joan', 'name.last': 'Well' },
      { id: 4, 'name.first': 'Gail', 'name.last': 'Polite' },
      { id: 5, 'name.first': 'Michael', 'name.last': 'Fair' },
      { id: 6, 'name.first': 'Mia', 'name.last': 'Fair' },
      { id: 7, 'name.first': 'Cora', 'name.last': 'Fair' },
      { id: 8, 'name.first': 'Jack', 'name.last': 'Right' },
    ],
    height: 320,
    colHeaders: true,
    rowHeaders: true,
    stretchH: 'all',
    columns: [
      { data: 'id', title: 'ID', type: 'numeric', readOnly: true },
      { data: 'name.first', title: 'First name' },
      { data: 'name.last', title: 'Last name' },
    ],
    contextMenu: true,
    fillHandle: false,
    manualColumnResize: true,
    manualRowResize: true
  };

}
