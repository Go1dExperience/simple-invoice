import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const TopBar = ({ email }: { email: string }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <div className="sticky top-0 flex items-center justify-between bg-darkBlue px-7 py-5">
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2.5 text-xl font-extrabold tracking-wide text-white hover:cursor-pointer"
      >
        <span className="h-3 w-3 rounded-full bg-accent" />
        SimpleInvoice
      </div>
      <div className="flex items-center gap-2.5 text-sm text-gray-400">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="grid h-8 w-8 place-items-center rounded-full border border-accent/45 font-bold text-white outline-none hover:cursor-pointer hover:border-accent">
              {email.charAt(0).toUpperCase()}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal text-muted-foreground">
              {email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
