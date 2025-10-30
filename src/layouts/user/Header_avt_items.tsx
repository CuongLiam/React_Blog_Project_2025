import type { MenuProps } from "antd";

// antd dropdown
export const items: MenuProps["items"] = [
  {
    key: "profile",
    label: (
      <div className="flex items-center gap-3 px-2 py-2">
        <img
          src="https://avatar.iran.liara.run/public"
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold">Rikkei</div>
          <div className="text-xs text-gray-500">rikkei@gmail.com</div>
        </div>
      </div>
    ),
    disabled: true,
  },
  { type: "divider" },
  {
    key: "view-profile",
    label: <span>View profile</span>,
  },
  {
    key: "update-avatar",
    label: <span>Update profile picture</span>,
  },
  {
    key: "change-password",
    label: <span>Change password</span>,
  },
  { type: "divider" },
  {
    key: "logout",
    label: <span className="text-red-500">Log out</span>,
    onClick: () => {
      localStorage.removeItem("userLogin");
      window.location.href = "/login";
    },
  },
];