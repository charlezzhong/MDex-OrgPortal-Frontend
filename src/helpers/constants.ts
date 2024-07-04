let baseUrl = true
  ? "https://organization.thisismdex.com"
  : "http://localhost:3000";

export const approvedUrl = `${baseUrl}/dashboard/home`;
export const pendingUrl = `${baseUrl}/verification/pending`;
export const rejected = `${baseUrl}/verification/rejected`;
export const createOrganization = `${baseUrl}/create-organization`;
