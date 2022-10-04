import axios from 'axios';

export const fetchRoleFeature = async (Id) =>  {
  try {
    const response = await axios.get(`/api/rolefeature/${Id}`);
    if(response && response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

// export const saveRoleFeature = async (values) =>  
// {
//   var response;
//   let result = values.roleFeatures;
//   if(values.formState === "new")
//   {
//     for(var i = 0; i < result.length;i++)
//     {
//       result[i].RoleID = parseInt(values.roleKey);
//       response = axios.put('/api/RoleFeature/Create', result[i])
//       .then(response => { 
//           return response.data;
//       })
//       .catch(error => {
//           return error;
//       });
//     }
//   }
//   else{
//     console.log("result",result);
//     for(var j = 0; j < result.length;j++){
//       result[j].RoleID = parseInt(values.roleKey);
//       response = axios.put('/api/rolefeature/Update', result[j])
//       .then(response => { 
//           return response.data;
//       })
//       .catch(error => {
//           return error;
//       });
//     }
//   }
//   return response;
// };
export const saveRoleFeature = async (values) => {
  let response;
  let result = { 
    roleId : parseInt(values.roleKey),
    roleFeatures : values.roleFeatures 
  };
    response = axios.post('/api/roleFeature/Create',result)
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
  return response;
}

