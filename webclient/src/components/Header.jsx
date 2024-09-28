import { ContainerFluid } from "@/components/ui/ContainerFluid";
import { VideoCameraIcon } from "@heroicons/react/24/outline";

export function Header() {
    return (
        <header className="py-4 fixed">
            <ContainerFluid>
                <VideoCameraIcon className="h-10 w-10 text-blue-gray-800" />
            </ContainerFluid>
        </header>
    );
}