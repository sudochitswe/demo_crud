using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using System.Security.Cryptography;
using CBMMIS_WebApi.Model;
using System.Data.SqlClient;
using CBMMIS_Web;
using System.Data.Common;
using System.Data;

namespace CBMMIS_WebApi.DataAccess
{
  public class RoleDA: BaseDA
  {

    public RoleDA()
    { }

    // public static List<Role> SelectAll()
    // {   
    //     string query = "select * from tblRole where RecordStatus != 'Delete' Order by RoleName";
    //     List<Role> types = new List<Role>();
    //     DbConnection conn = CreateMainConnection();
    //       // Create the command.
    //     DbCommand cmd = conn.CreateCommand();
    //     //cmd.AddInputParameter("@parameterName", "value");
    //      // Create and execute the DbCommand.
    //     cmd.CommandText = query;
    //     try
    //     { 
    //       // Open the connection.
    //         conn.Open();
    //           // Retrieve the data.
    //            //Reads a forward-only stream of rows from a data source.
    //         using (DbDataReader reader = cmd.ExecuteReader())
    //         {
    //             while (reader.Read())
    //             {
    //                 types.Add(new Role()
    //                 {
    //                     RoleKey = Convert.ToInt32(reader["RoleKey"]),
    //                     RoleName = reader["RoleName"].ToString(),
    //                     RecordStatus = reader["RecordStatus"].ToString(),
    //                     CreatedBy = reader["CreatedBy"].ToString(),
    //                     CreatedDate = DateTime.Parse(reader["CreatedDate"].ToString()),
    //                     UpdatedBy = (reader["UpdatedBy"] != System.DBNull.Value ? reader["UpdatedBy"].ToString() : ""),
    //                     UpdatedDate = (reader["UpdatedDate"] != System.DBNull.Value ? DateTime.Parse(reader["UpdatedDate"].ToString()) : DateTime.Now),
    //                 });
    //             }
    //         }
    //     }
    //       catch (Exception exp)
    //       {
    //         Console.WriteLine("exp {0}",exp.Message);
    //       }
    //     finally
    //     {
    //         if (conn.State == ConnectionState.Open)
    //             conn.Close();
    //     }

        
    //     return types;
    // }

    public static int GetTotalRecord()
    {
        string queryString = String.Format("SELECT COUNT(1) FROM tblrole WHERE RecordStatus != 'Delete'");
        int recordCount = 0; 
        DbConnection connection = CreateMainConnection();
        DbCommand cmd = connection.CreateCommand();
        try 
        {
          
          cmd.CommandText = queryString;
          connection.Open();
          //ExecuteScalar() => The first column of the first row in the result set / Count(1) : 12
          recordCount = Convert.ToInt32(cmd.ExecuteScalar());
        }
        catch (Exception exp)
        {
          Console.WriteLine("GetTotalRecord Funciton exp {0}",exp.Message);
          recordCount = 0;
        }
        finally
        {
          if(connection.State == ConnectionState.Open )
            connection.Close();
        }
        connection.Close();
        return recordCount;
    }
    public static int GetDuplicateRole(string filter)
    {
      string queryString = String.Format("SELECT COUNT(1) FROM tblrole {0} ",filter);
      int recordCount = 0; 
      DbConnection connection = CreateMainConnection();
      DbCommand cmd = connection.CreateCommand();
      try 
      {
        
        cmd.CommandText = queryString;
        connection.Open();
        recordCount = Convert.ToInt32(cmd.ExecuteScalar());
      }
      catch (Exception exp)
      {
        Console.WriteLine("GetTotalRecord Funciton exp {0}",exp.Message);
        recordCount = 0;
      }
      finally
      {
        if(connection.State == ConnectionState.Open )
          connection.Close();
      }
      connection.Close();
      return recordCount;
    }
    public static ResultStatus SelectById(int id)
    {
      Role data  = new Role();
      ResultStatus result  = new ResultStatus();
      string queryString = String.Format("SELECT * FROM tblrole WHERE RoleKey={0}", id);
      using (DbConnection connection = CreateMainConnection())
      {
        DbCommand cmd = connection.CreateCommand();
        cmd.CommandText = queryString;
        try
        {
          connection.Open();
          DbDataReader reader = cmd.ExecuteReader();
          while (reader.Read())
          {
            data = new Role()
            {
              RoleKey = Convert.ToInt32(reader["RoleKey"]),
              RoleName = reader["RoleName"].ToString(),
              RecordStatus = reader["RecordStatus"].ToString(),
              CreatedBy = reader["CreatedBy"].ToString(),
              CreatedDate = DateTime.Parse(reader["CreatedDate"].ToString()),
              UpdatedBy = (reader["UpdatedBy"] != System.DBNull.Value ? reader["UpdatedBy"].ToString() : ""),
              UpdatedDate = (reader["UpdatedDate"] != System.DBNull.Value ? DateTime.Parse(reader["UpdatedDate"].ToString()) : DateTime.Now),
            };
          }
          connection.Close();
        }
        catch(Exception exp)
        {
          result.Status = false;
          result.Message = exp.Message;
          return result;
        }
        finally
        {
           if(connection.State == ConnectionState.Open )
              connection.Close();
        }
      }
      result.Data = data;
      return result;
    }
    //paging and select
    public static RoleCollection SelectByFilter(int currentPage, int rowPerPage, string searchKeyword)
    {
  
        RoleCollection collection = new RoleCollection();
        List<Role> types = new List<Role>();  

        // select * from cbmmis_dev.tblrole WHERE RecordStatus != 'Delete' AND RoleName LIKE '%a%' ORDER BY RoleKey LIMIT 0 , 5;

        string queryString = "select * from tblrole";
        // # Record Status
        string filter = " WHERE RecordStatus != 'Delete' ";
        filter += " AND (RoleName LIKE '%" + searchKeyword +  "%') ";
        // # Order By
        filter += " ORDER BY RoleKey";
        queryString += filter;
        // # Limit
        if (currentPage > 0 && rowPerPage > 0)
        {
          if (DatabaseType == DatabaseType.MSSQL)
          {
            queryString += " OFFSET "+ (currentPage * rowPerPage - rowPerPage) + " ROWS FETCH NEXT "+ rowPerPage +" ROWS ONLY; ";
          }
          else
          {
            queryString += " LIMIT " + (currentPage * rowPerPage - rowPerPage) + ", " + rowPerPage;
          }
        }
        using (DbConnection connection = CreateMainConnection())
        {
            DbCommand cmd = connection.CreateCommand();
            cmd.CommandText = queryString;
            try
            {
              connection.Open();
              DbDataReader reader = cmd.ExecuteReader();
              while (reader.Read())
              {
                  types.Add(new Role()
                  {
                      RoleKey = Convert.ToInt32(reader["RoleKey"]),
                      RoleName = reader["RoleName"].ToString(),
                      RecordStatus = reader["RecordStatus"].ToString(),
                      CreatedBy = reader["CreatedBy"].ToString(),
                      CreatedDate = DateTime.Parse(reader["CreatedDate"].ToString()),
                      UpdatedBy = (reader["UpdatedBy"] != System.DBNull.Value ? reader["UpdatedBy"].ToString() : ""),
                      UpdatedDate = (reader["UpdatedDate"] != System.DBNull.Value ? DateTime.Parse(reader["UpdatedDate"].ToString()) : DateTime.Now),
                  }
                  );
              }
              connection.Close();
            }
            catch(Exception exp)
            {
              Console.WriteLine("exp {0}",exp.Message);         
            }
            finally
            {
              if(connection.State == ConnectionState.Open )
                connection.Close();
            }
        }
        Console.WriteLine("types");
        collection.TotalRecord = GetTotalRecord();
        Console.WriteLine(collection.TotalRecord);
        collection.Records = types;
        return collection;
    }
    public static ResultStatus Create(Role obj)
    {
        ResultStatus result = new ResultStatus();
        List<Feature> types = new List<Feature>();
        string queryString = String.Format("INSERT INTO tblrole ( RoleName, RecordStatus, CreatedBy, CreatedDate,UpdatedBy,UpdatedDate ) VALUES ( @RoleName, @RecordStatus, @CreatedBy, @CreatedDate,@UpdatedBy, @UpdatedDate );");
        if(DatabaseType == DatabaseType.MSSQL)
        {
          queryString += " SELECT RoleKey AS LastID FROM tblrole WHERE RoleKey = @@Identity;";
        }
        else 
        {
          queryString += " Select LAST_INSERT_ID();";
        }
        // Create the parameters
        DbConnection connection = CreateMainConnection();
        DbCommand cmd = connection.CreateCommand();
        cmd.ParametersAddWithValue("RoleName", obj.RoleName);
        cmd.ParametersAddWithValue("RecordStatus", obj.RecordStatus);
        cmd.ParametersAddWithValue("CreatedBy", obj.CreatedBy);
        cmd.ParametersAddWithValue("CreatedDate", DateTime.Now);
        cmd.ParametersAddWithValue("UpdatedBy", obj.UpdatedBy);
        cmd.ParametersAddWithValue("UpdatedDate", DateTime.Now);

        try
        {
          cmd.CommandText = queryString;
          connection.Open();
          obj.RoleKey = Convert.ToInt32(cmd.ExecuteScalar()); // get role key

          // types = FeatureDA.Select();

          // if (types.Count != 0)
          // {
          //     foreach (Feature t in types)
          //     {
          //         RoleFeature rolefeature = new RoleFeature();

          //         rolefeature.RoleID = obj.RoleKey;
          //         rolefeature.FeatureID = t.FeatureID;
          //         rolefeature.ViewPerm = 1;
          //         rolefeature.AddPerm = 0;
          //         rolefeature.EditPerm = 0;
          //         rolefeature.DeletePerm = 0;
          //         rolefeature.CreatedBy = obj.CreatedBy;
          //         rolefeature.CreatedDate = DateTime.Now;
          //         rolefeature.UpdatedBy = obj.UpdatedBy;
          //         rolefeature.UpdatedDate = DateTime.Now;

          //         RoleFeatureDA.Create(rolefeature);
          //     }
          // }
        }
        catch (Exception exp)
        {
            result.Status = false;
            result.Message = exp.Message;
        }
        finally
        {
            if(connection.State == ConnectionState.Open)
                connection.Close();
        }
        connection.Close();
        return result;
    }
    public static ResultStatus Update(Role obj)
    {
      ResultStatus result = new ResultStatus();
      string queryString = String.Format("UPDATE tblrole SET RoleName=@RoleName,RecordStatus=@RecordStatus, UpdatedBy=@UpdatedBy, UpdatedDate=@UpdatedDate where RoleKey=@RoleKey");

      // Create the parameters
      DbConnection connection = CreateMainConnection();
      DbCommand cmd = connection.CreateCommand();

      cmd.ParametersAddWithValue("RoleKey", Convert.ToInt32(obj.RoleKey.ToString()));
      cmd.ParametersAddWithValue("RoleName", obj.RoleName);
      cmd.ParametersAddWithValue("RecordStatus", obj.RecordStatus);
      cmd.ParametersAddWithValue("UpdatedBy", obj.UpdatedBy);
      cmd.ParametersAddWithValue("UpdatedDate", DateTime.Now);
      try
      {
        cmd.CommandText = queryString;
        connection.Open();
        cmd.ExecuteNonQuery();
      }
      catch (Exception exp)
      {
          result.Status = false;
          result.Message = exp.Message;
      }
      finally
      {
        if(connection.State == ConnectionState.Open)
            connection.Close();
      }
      connection.Close();
      return result;
    }
    public static ResultStatus Delete(Role obj)
    {
      ResultStatus result = new ResultStatus();
      string queryString = String.Format("update tblrole set RecordStatus=@RecordStatus, UpdatedBy=@UpdatedBy, UpdatedDate=@UpdatedDate where RoleKey={0}", obj.RoleKey);
      // Create the parameters
      DbConnection connection = CreateMainConnection();
      DbCommand cmd = connection.CreateCommand();

      cmd.ParametersAddWithValue("RoleKey", obj.RoleKey);
      cmd.ParametersAddWithValue("RecordStatus", "Delete");
      cmd.ParametersAddWithValue("UpdatedBy", obj.UpdatedBy);
      cmd.ParametersAddWithValue("UpdatedDate", DateTime.Now);

      try
      {
        cmd.CommandText = queryString;
        connection.Open();
        cmd.ExecuteNonQuery();
      }
      catch (Exception exp)
      {
        result.Status = false;
        result.Message = exp.Message;
      }
      finally
      {
        if(connection.State == ConnectionState.Open)
            connection.Close();
      }
      connection.Close();
      return result;
    }

  }
}
