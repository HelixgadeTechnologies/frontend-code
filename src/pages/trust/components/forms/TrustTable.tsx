import { useState, useRef, useEffect, useMemo, useCallback } from "react";

import { useNavigate, Link } from "react-router-dom";
import {
  Table,
  Modal,
  EmptyTable,
  LoadingTable,
  ActiveMenu,
} from "../../../../components/elements";
import DeleteTrust from "./DeleteTrust";

import { TrustArray, TrustItem } from "../../../../utils/types";

import { RowSelectionState } from "@tanstack/react-table";

import { useGetAllTrusts } from "../../../../utils/hooks/useTrusts";

const TrustTable = () => {
  const navigate = useNavigate();
  const { isLoading, data } = useGetAllTrusts();

  const trusts: TrustArray = useMemo(() => {
    const trustData = data?.data?.data || [];
    return trustData.map((trust: { trustId: string }) => ({
      ...trust,
      id: trust.trustId,
    }));
  }, [data]);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // State to track which user is being edited or deleted
  const [deleteTrustId, setDeleteTrustId] = useState<string | null>(null);

  // Toggle action menu
  const toggleMenu = useCallback(
    (trustId: string) => {
      setActiveMenu(activeMenu === trustId ? null : trustId);
    },
    [activeMenu],
  );

  // Handle delete account
  const handleDelete = useCallback((trustId: string | null = null) => {
    setDeleteTrustId(trustId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if clicking outside both the menu and the trigger button
      if (
        activeMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(
          `[data-menu-trigger="${activeMenu}"]`,
        )
      ) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);

  // Define columns with memoization
  const columns = useMemo(
    () => [
      {
        id: "trustName",
        header: "Trust",
        accessorKey: "trustName",
        cell: ({ row }: { row: { original: TrustItem } }) => {
          const trustName = `${row.original.trustName}`;
          const id = row.original.id;
          const formattedName = trustName.toLowerCase().replace(/\s+/g, "-");

          return (
            <Link
              className="hover:underline"
              to={`/trust/${formattedName}/${id}`}
            >
              {trustName}
            </Link>
          );
        },
      },
      {
        id: "funds",
        header: "Total Funds",
        accessorKey: "funds",
      },
      {
        id: "communities",
        header: "Community",
        accessorKey: "trustCommunities",
        cell: ({ row }: { row: { original: TrustItem } }) => {
          const communities = row.original.trustCommunities;
          return (
            <span>
              {communities}
              {/* {communities?.map((i, index) => (
                  <span key={index}>{i}</span>
                ))} */}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }: { row: { original: TrustItem } }) => {
          const trust = row.original;

          return (
            <div className="relative">
              <button
                data-menu-trigger={trust?.id}
                className="px-3 text-gray-5 hover:text-gray-7 cursor-pointer"
                onClick={() => toggleMenu(trust?.id)}
                aria-label="More options"
              >
                •••
              </button>
              <ActiveMenu
                userId={trust?.id}
                activeMenu={activeMenu}
                menuRef={menuRef}
                handleEdit={() =>
                  navigate(`/dashboard/trusts/edit/${trust?.id}`)
                }
                handleDelete={() => handleDelete(trust?.id)}
              />
            </div>
          );
        },
      },
    ],
    [activeMenu, toggleMenu, handleDelete],
  );

  const tableHead = ["Trust", "Total Funds", "Communities", "action"];

  return (
    <div className="mt-10 bg-white p-4 rounded-2xl border border-gray-8 ">
      <>
        {isLoading ? (
          <LoadingTable headArr={tableHead} />
        ) : trusts && trusts?.length > 0 ? (
          <Table
            columns={columns}
            data={trusts}
            count={trusts?.length}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        ) : (
          <EmptyTable
            headArr={tableHead}
            heading="No Trust data available."
            text="Create trust to get started!"
          />
        )}
      </>
      {/* Modals */}

      {deleteTrustId && (
        <Modal
          body={
            <DeleteTrust
              // userId={deleteTrustId}
              // close={() => handleDelete(null)}
            />
          }
        />
      )}
    </div>
  );
};

export default TrustTable;
