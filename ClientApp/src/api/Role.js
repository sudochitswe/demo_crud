import axios from 'axios';

// export const fetchRoles = async () =>  {
//   try {
//     const response = await axios.get(`/api/role/SelectAll`);
//     if(response && response.status === 200) {
//       return response.data;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

export const fetchRoleByFilter = async (currentPage, rowPerPage, searchKeyword) =>  {
  try {
    const response = await axios.get(`/api/role/filterBy/`,
      { params: {currentPage, rowPerPage, searchKeyword} }
    );
    if(response && response.status === 200) {
      // From Role response => [object Object]
      // console.log(`From Role response => ${response.data}`)
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchRole = async (id) => {
  try {
    const response = await axios.get(`/api/role/SelectById/`,
    { params: {id}
    });
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
}

export const saveRole = async (values) => {
  const data = {
    roleName: values.roleName,
    recordStatus: values.recordStatus,
  }
  console.log("valuse",values);
  var response;
  if( values.rowKey === "" || values.rowKey === null ){
     response = axios.post('/api/role/Create', data)
    .then(response => { 
      console.log("response" , response);
        return response.data;
    })
    .catch(error => {
        return error;
    });
  } else {
    data.RoleKey = parseInt(values.roleKey);
     response = axios.put('/api/role/Update', data)
    .then(response => { 
      return response.data;
    })
    .catch(error => {
        return error;
    });
   }
  return response;
};

export const deleteRole = async (data) => {
  try {
    const response = await axios.post('/api/role/delete', {
      roleName: data.roleName,
      RoleKey: data.roleKey,
      RecordStatus: 'Deleted',
    });
    if(response && response.status === 200) {
      return response.data.status;
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchDuplicateRole = async(name)=> {
  const filter = `where roleName = '${name}' and recordStatus = 'Active'`
  try{
    const response = await axios.get(`/api/role/GetDuplicateRole`,
    { params: {filter} });
    if(response && response.status === 200) {
      // console.log(`response => ${response.data}`);
      // response => 1
      return response.data;
    }
  }
  catch(error){
  }
}

