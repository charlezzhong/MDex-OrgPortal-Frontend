const isLive = true;
export const imgUrl = isLive
  ? "https://api.thisismdex.com"
  : "http://localhost:8000";
/*const baseUrl = isLive
  ? "https://api.thisismdex.com/ipa"
  : "http://localhost:5000/ipa/v2/testing";*/

const baseUrl = isLive
  ? "http://localhost:5000/ipa/v2/testing"
  : "http://localhost:5000/ipa/v2/testing";

export const urls = {
  organization: {
    create: `${baseUrl}/organization/create`,
    update: `${baseUrl}/organization/update`,
    getByEmail: `${baseUrl}/organization/getOrganization`,
    getAnalytics: `${baseUrl}/organization/analytics`,
  },
  staff: {
    fetchMembers: `${baseUrl}/staffMembers`,
    fetchMember: `${baseUrl}/staffMember`, //add staffId as param
    create: `${baseUrl}/staffMember`,
    update: `${baseUrl}/staffMember`, //add staffId as param
    delete: `${baseUrl}/staffMember`, //add staffId as param
  },
  jobpostings: {
    fetchMembers: `${baseUrl}/jobpostings`,
    fetchMember: `${baseUrl}/jobposting`, //add jobpostingId as param
    create: `${baseUrl}/jobposting`,
    update: `${baseUrl}/jobposting`, //add jobpostingId as param
    delete: `${baseUrl}/jobposting`, //add jobpostingId as param
  },
  post: {
    create: `${baseUrl}/postFeed`,
    selector: `${baseUrl}/selector`,
    getPost: `${baseUrl}/org/postFeed`,
    getSinglePost: `${baseUrl}/postFeed`,
    getRsvps: `${baseUrl}/org/rsvps`,
    index: `${baseUrl}/postFeed/summary`,
  },
  rsvp: {
    index: `${baseUrl}/rsvps`,
  },
};
