import { statusValue } from "@/helpers/enum";
import { GET, POST } from "@/services/api";
import { urls } from "@/services/uri";
import { Organization } from "@/types/org.interface";
import { Staff } from "@/types/staff.interface";
import { setCookie } from "cookies-next";

// let baseUrl = true ? 'http://localhost:3000': 'http://localhost:3000';
// let approvedUrl = `${baseUrl}/home`;
// let pendingUrl = `${baseUrl}/verification/pending`;
// let rejected = `${baseUrl}/verification/rejected`;
// let createOrganization = `${baseUrl}/create-organization`;

interface IResponse {
  message: string;
  data: {
    organization: Organization | null;
    staff: Staff | null;
  };
  status: number;
}

export const handleUserAuth = async (
  email: string
): Promise<IResponse | null> => {
  try {
    const org: any = await POST(`${urls.organization.getByEmail}`, { email });
    return org.data;
  } catch (error: any) {
    //console.log(error);
    return null;
  }
};
