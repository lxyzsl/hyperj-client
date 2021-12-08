import { getSystemRoleList } from '@/services/system/role';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Switch } from 'antd';
import React, { useRef } from 'react'

const RoleList:React.FC = () =>{

    const actionRef = useRef<ActionType>();

    const reloadData = () =>{
        actionRef.current!.reload();
    }

    const columns: ProColumns<ApiResp.System.Role.RoleInterface>[] = [
        {
            title: "ID",
            dataIndex: 'roleId',
            valueType: 'textarea',
            hideInSearch: true,
        },
        {
            title: "角色名称",
            dataIndex: 'roleName',
            valueType: 'text',
        },
        {
            title: "权限字符",
            dataIndex: 'roleKey',
            valueType: 'text',
        },
        {
            title: "显示顺序",
            dataIndex: 'roleSort',
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
            render:(_,entity)=>(
                <Switch   defaultChecked={entity.status==="1"}  size="small"/>
            ),
            width: "sm"
        },
        {
            title: "创建时间",
            dataIndex: 'createTime',
            valueType: 'text',
        },
        {
            title: '操作',
            dataIndex: 'option',
            width: '180px',
            valueType: 'option',
        }
    ]

    return (
        <PageContainer>
            <ProTable<ApiResp.System.Role.RoleInterface>
                actionRef={actionRef}
                columns={columns}
                rowKey="userId"
                request={getSystemRoleList}
            />
        </PageContainer>
    )
}

export default RoleList;