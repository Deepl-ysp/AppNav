import pymysql

class ConnectDB:
    def __init__(self, host, user, password, database):
        '''
        self.host = 主机名或主机IP地址
        self.user = 用户名
        self.password = 密码
        self.database = 数据库名
        '''
        self.host = host
        self.user = user
        self.password = password
        self.database = database

    def connect(self):
        '''
        连接数据库
        '''
        try:
            self.conn = pymysql.connect(host=self.host, user=self.user, password=self.password, database=self.database)
            self.cursor = self.conn.cursor()
        except pymysql.MySQLError as e:
            print("Error connecting to MySQL: ", e)
            self.conn = None
            self.cursor = None
            return False

    def getdata_type(self, table, index, value, type):
        '''
        获取数据
        table: 表名
        index: 索引
        value: 值
        type: 类型条件（支持模糊查询）
        return: 返回查询结果
        '''
        if not self.cursor:
            print("Database connection is not established.")
            return False
        try:
            # 使用LIKE进行模糊查询type字段
            sql = f"SELECT * FROM {table} WHERE {index} = %s AND type LIKE %s"
            self.cursor.execute(sql, (value, f"%{type}%"))
            result = self.cursor.fetchall()
            # 将元组转换为列表
            result = [list(i) for i in result]
            return result
        except pymysql.MySQLError as e:
            print("Error executing query: ", e)
            return False

    def getdata_like(self, table, index, value):
        '''
        获取数据
        table: 表名
        index: 索引
        value: 值
        return: 返回查询结果
        '''
        if not self.cursor:
            print("Database connection is not established.")
            return False
        try:
            sql = f"SELECT * FROM {table} WHERE {index} LIKE %s"
            self.cursor.execute(sql, (f"%{value}%",))
            result = self.cursor.fetchall()
            # 将元组转换为列表
            result = [list(i) for i in result]
            return result
        except pymysql.MySQLError as e:
            print("Error executing query: ", e)
            return False

    def delSQL(self):
        '''
        关闭数据库连接
        '''
        self.conn.close()
        return True

if __name__ == '__main__':
    SQL = ConnectDB('localhost', 'root', '1qaz0plm', 'appnav')
    SQL.connect()
    # test = SQL.getallthedata('projectlist')
    test = SQL.getdata_like('projectlist', 'name', 'Git')
    SQL.delSQL()
    print(test)
    pass