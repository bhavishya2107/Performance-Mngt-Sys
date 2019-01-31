import React, { Component } from 'react';
import { form,Label} from 'react'

class AddDept extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     depId: 1,
        //     depName: "dot net",
        //     description: "department of dot net",
        //     createdBy: 2,
        //     createdOn: "2019-01-29T18:30:00.000Z",
        //     modifiedBy: 2,
        //     modifiedOn: "2019-01-08T18:30:00.000Z"
        // }
    }
    render() {
        return (
            <div>
                <form>
                     <div>
                        {/* <Label for="depName" sm={2}>Name</Label> */}
                        <label >Name</label>
                        <input type="text" id="depName" placeholder="Enter the Name"></input>

                    </div>

                    {/* <div>
                        <Label for="description" sm={2}>Description</Label>
                        <input type="text-area" id="description"></input>
                        
                    </div> */} */}
                    <button type="button">Save</button>
                    <button type="button">clear</button>
                </form>
            </div >
        )

    }
}
export default AddDept;