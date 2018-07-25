let http = {
  codes: {
    ok:                    200,
    created:               201,
    accepted:              202,
    no_content:            204,
    moved_permanently:     301,
    found:                 302,
    not_modified:          304,
    bad_request:           400,
    unauthorized:          401,
    not_found:             404,
    method_not_allowed:    405,
    unprocessable_entity:  422,
    internal_server_error: 500,
    not_implemented:       501,
    bad_gateway:           502,
    service_unavailable:   503,
    gateway_timeout:       504
  }
};

module.exports = http;
