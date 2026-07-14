import { useQuery, useMutation, useQueryClient } from "react-query";
import DashboardLayout from "../components/layout/DashboardLayout";
import axiosClient from "../api/axiosClient";
import { User } from "../types";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";

async function fetchUsers(): Promise<User[]> {
  const { data } = await axiosClient.get<User[]>("/admin/users");
  return data;
}

async function fetchStats() {
  const { data } = await axiosClient.get("/admin/stats");
  return data;
}

export default function AdminPanelPage() {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading } = useQuery("admin-users", fetchUsers);
  const { data: stats } = useQuery("admin-stats", fetchStats);

  const updateRole = useMutation(
    ({ id, role }: { id: string; role: string }) =>
      axiosClient.put(`/admin/users/${id}/role`, { role }),
    { onSuccess: () => queryClient.invalidateQueries("admin-users") }
  );

  const deleteUser = useMutation((id: string) => axiosClient.delete(`/admin/users/${id}`), {
    onSuccess: () => queryClient.invalidateQueries("admin-users")
  });

  return (
    <DashboardLayout>
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Admin Panel</h2>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatBox label="Users" value={stats.users} />
          <StatBox label="Vehicles" value={stats.vehicles} />
          <StatBox label="Drivers" value={stats.drivers} />
          <StatBox label="Routes" value={stats.routes} />
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Email</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Role</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">
                    <select
                      className="rounded border border-gray-300 px-2 py-1 text-xs"
                      value={u.role}
                      onChange={(e) => updateRole.mutate({ id: u.id, role: e.target.value })}
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="DISPATCHER">Dispatcher</option>
                      <option value="DRIVER">Driver</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <Button variant="danger" onClick={() => deleteUser.mutate(u.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
