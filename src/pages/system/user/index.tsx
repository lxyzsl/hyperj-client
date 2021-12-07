import { getSystemUserList, setSystemStatus } from '@/services/system/user';
import { PageContainer } from '@ant-design/pro-layout'
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table'
import { message, Switch } from 'antd';
import React, { useRef } from 'react'
import Storage from '@/constants/storage'


const SystemUserList:React.FC = () => {

    const actionRef = useRef<ActionType>();

    const reloadData = () =>{
        actionRef.current!.reload();
    }

     /**
     * 启用/停用
     * @param courseId 课程ID
     * @param checked 是否启用
     */
    const changeEnabeld = async (userId: string,checked:boolean) =>{
        const status = checked ? "1" :"0"
        const result = await setSystemStatus(userId,status)
            if(result.success){
            actionRef.current!.reload();
            message.success("操作成功")
        }
    }


    const columns: ProColumns<ApiResp.System.User.UserInterface>[] = [
        {
            title: "ID",
            dataIndex: 'userId',
            valueType: 'textarea',
            hideInSearch: true,
        },
        {
            title: "手机号码",
            dataIndex: 'mobile',
            valueType: 'text',
          },
        {
            title: "用户昵称",
            dataIndex: 'nickName',
            valueType: 'text',
        },
        {
            title: "用户邮箱",
            dataIndex: 'email',
            valueType: 'text',
        },
        {
            title: '状态',
            dataIndex: 'status',
            valueEnum: {
                0: { text: '停用', status: 'Default' },
                1: { text: '启用', status: 'Success' },
            
            },
            valueType: 'checkbox',
            render:(_,entity)=>{
                const currentUserStorage = localStorage.getItem(Storage.USER_INFO_KEY);
                const currentUser = JSON.parse(currentUserStorage!) as ApiResp.Account.CurrentUserInterface;
              return (
                <Switch disabled={entity.root === "1" || entity.userId === currentUser.user.userId}  defaultChecked={entity.status==="1"}  onChange={(checked:boolean)=>changeEnabeld(entity.userId,checked)} size="small"/>
              )
            },
            width: "sm"
        },
        {
            title: '操作',
            dataIndex: 'option',
            width: '220px',
            valueType: 'option',
            render: (_, record) => [

            ]}
    ]

    return (
        <PageContainer>
            <div style={{ width: '20%', height: '100%', float: 'left' }}>
                部门相关
            </div>
            <div style={{ width: '79%', float: 'right' }}>
                <ProTable<ApiResp.System.User.UserInterface>
                    actionRef={actionRef}
                    columns={columns}
                    rowKey="userId"
                    request={getSystemUserList}
                >
                    
                </ProTable>
            </div>
        </PageContainer> 
    )
}

export default SystemUserList